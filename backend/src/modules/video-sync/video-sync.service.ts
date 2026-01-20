import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { VideoState, RoomRole } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';
import {
  VideoStateDto,
  VideoStateResponseDto,
  VideoChangeDto,
} from './dto';

@Injectable()
export class VideoSyncService {
  private readonly logger = new Logger(VideoSyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getVideoState(roomId: string): Promise<VideoStateResponseDto | null> {
    const videoState = await this.prisma.videoState.findUnique({
      where: { roomId },
    });

    if (!videoState) {
      return null;
    }

    return this.toVideoStateResponse(videoState);
  }

  async createVideoState(roomId: string): Promise<VideoState> {
    const existingState = await this.prisma.videoState.findUnique({
      where: { roomId },
    });

    if (existingState) {
      return existingState;
    }

    const videoState = await this.prisma.videoState.create({
      data: {
        roomId,
        currentTime: 0,
        isPlaying: false,
        playbackRate: 1.0,
      },
    });

    this.logger.log(`Created VideoState for room ${roomId}`);

    return videoState;
  }

  async updateVideoState(
    roomId: string,
    userId: string,
    updateData: Partial<VideoStateDto>,
  ): Promise<VideoStateResponseDto> {
    await this.validateRoomMember(roomId, userId);

    const videoState = await this.prisma.videoState.findUnique({
      where: { roomId },
    });

    if (!videoState) {
      throw new NotFoundException(
        `Video state not found for room ${roomId}`,
      );
    }

    const updated = await this.prisma.videoState.update({
      where: { roomId },
      data: {
        ...updateData,
        lastUpdated: new Date(),
      },
    });

    this.logger.log(
      `Video state updated for room ${roomId} by user ${userId}`,
    );

    return this.toVideoStateResponse(updated);
  }

  async playVideo(
    roomId: string,
    userId: string,
    currentTime: number,
  ): Promise<VideoStateResponseDto> {
    return this.updateVideoState(roomId, userId, {
      isPlaying: true,
      currentTime,
    });
  }

  async pauseVideo(
    roomId: string,
    userId: string,
    currentTime: number,
  ): Promise<VideoStateResponseDto> {
    return this.updateVideoState(roomId, userId, {
      isPlaying: false,
      currentTime,
    });
  }

  async seekVideo(
    roomId: string,
    userId: string,
    currentTime: number,
  ): Promise<VideoStateResponseDto> {
    return this.updateVideoState(roomId, userId, {
      currentTime,
    });
  }

  async changeVideo(
    roomId: string,
    userId: string,
    videoChangeDto: VideoChangeDto,
  ): Promise<VideoStateResponseDto> {
    return this.updateVideoState(roomId, userId, {
      videoId: videoChangeDto.videoId,
      videoTitle: videoChangeDto.videoTitle,
      videoThumbnail: videoChangeDto.videoThumbnail,
      currentTime: 0,
      isPlaying: false,
    });
  }

  async changePlaybackRate(
    roomId: string,
    userId: string,
    rate: number,
  ): Promise<VideoStateResponseDto> {
    return this.updateVideoState(roomId, userId, {
      playbackRate: rate,
    });
  }

  async validateRoomMember(roomId: string, userId: string): Promise<void> {
    const member = await this.prisma.roomMember.findFirst({
      where: {
        roomId,
        userId,
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this room');
    }
  }

  async canControlVideo(roomId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.roomMember.findFirst({
      where: {
        roomId,
        userId,
      },
    });

    if (!member) {
      return false;
    }

    return (
      member.role === RoomRole.HOST || member.role === RoomRole.MODERATOR
    );
  }

  private toVideoStateResponse(videoState: VideoState): VideoStateResponseDto {
    return {
      roomId: videoState.roomId,
      videoId: videoState.videoId ?? undefined,
      videoTitle: videoState.videoTitle ?? undefined,
      videoThumbnail: videoState.videoThumbnail ?? undefined,
      currentTime: videoState.currentTime,
      isPlaying: videoState.isPlaying,
      playbackRate: videoState.playbackRate,
      lastUpdated: videoState.lastUpdated,
    };
  }
}
