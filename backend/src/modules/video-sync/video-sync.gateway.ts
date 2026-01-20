import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { VideoSyncService } from './video-sync.service';
import {
  SyncRequestDto,
  VideoPlayDto,
  VideoPauseDto,
  VideoSeekDto,
  VideoChangeDto,
  PlaybackRateChangeDto,
} from './dto';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  namespace: 'video-sync',
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class VideoSyncGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(VideoSyncGateway.name);

  constructor(
    private readonly videoSyncService: VideoSyncService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        this.logger.warn(
          `Client ${client.id} connected without token to video-sync namespace`,
        );
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      client.userId = payload.sub;

      this.logger.log(
        `Client ${client.id} connected to video-sync as user ${client.userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Authentication failed for client ${client.id} in video-sync namespace`,
        error,
      );
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client ${client.id} disconnected from video-sync`);
  }

  @SubscribeMessage('video_play')
  async handleVideoPlay(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: VideoPlayDto,
  ) {
    try {
      if (!client.userId) {
        return { error: 'Not authenticated' };
      }

      const canControl = await this.videoSyncService.canControlVideo(
        data.roomId,
        client.userId,
      );

      if (!canControl) {
        throw new ForbiddenException(
          'Only host and moderators can control video playback',
        );
      }

      const videoState = await this.videoSyncService.playVideo(
        data.roomId,
        client.userId,
        data.currentTime,
      );

      this.server.to(`room:${data.roomId}`).emit('video_state_updated', {
        videoState,
        action: 'play',
        userId: client.userId,
      });

      this.logger.log(
        `User ${client.userId} played video in room ${data.roomId}`,
      );

      return { success: true, videoState };
    } catch (error) {
      this.logger.error(
        `Error playing video in room ${data.roomId}`,
        error,
      );
      return {
        error: error instanceof Error ? error.message : 'Failed to play video',
      };
    }
  }

  @SubscribeMessage('video_pause')
  async handleVideoPause(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: VideoPauseDto,
  ) {
    try {
      if (!client.userId) {
        return { error: 'Not authenticated' };
      }

      const canControl = await this.videoSyncService.canControlVideo(
        data.roomId,
        client.userId,
      );

      if (!canControl) {
        throw new ForbiddenException(
          'Only host and moderators can control video playback',
        );
      }

      const videoState = await this.videoSyncService.pauseVideo(
        data.roomId,
        client.userId,
        data.currentTime,
      );

      this.server.to(`room:${data.roomId}`).emit('video_state_updated', {
        videoState,
        action: 'pause',
        userId: client.userId,
      });

      this.logger.log(
        `User ${client.userId} paused video in room ${data.roomId}`,
      );

      return { success: true, videoState };
    } catch (error) {
      this.logger.error(
        `Error pausing video in room ${data.roomId}`,
        error,
      );
      return {
        error: error instanceof Error ? error.message : 'Failed to pause video',
      };
    }
  }

  @SubscribeMessage('video_seek')
  async handleVideoSeek(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: VideoSeekDto,
  ) {
    try {
      if (!client.userId) {
        return { error: 'Not authenticated' };
      }

      const canControl = await this.videoSyncService.canControlVideo(
        data.roomId,
        client.userId,
      );

      if (!canControl) {
        throw new ForbiddenException(
          'Only host and moderators can control video playback',
        );
      }

      const videoState = await this.videoSyncService.seekVideo(
        data.roomId,
        client.userId,
        data.currentTime,
      );

      this.server.to(`room:${data.roomId}`).emit('video_state_updated', {
        videoState,
        action: 'seek',
        userId: client.userId,
      });

      this.logger.log(
        `User ${client.userId} seeked video to ${data.currentTime}s in room ${data.roomId}`,
      );

      return { success: true, videoState };
    } catch (error) {
      this.logger.error(
        `Error seeking video in room ${data.roomId}`,
        error,
      );
      return {
        error: error instanceof Error ? error.message : 'Failed to seek video',
      };
    }
  }

  @SubscribeMessage('video_change')
  async handleVideoChange(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: VideoChangeDto,
  ) {
    try {
      if (!client.userId) {
        return { error: 'Not authenticated' };
      }

      const canControl = await this.videoSyncService.canControlVideo(
        data.roomId,
        client.userId,
      );

      if (!canControl) {
        throw new ForbiddenException(
          'Only host and moderators can change videos',
        );
      }

      const videoState = await this.videoSyncService.changeVideo(
        data.roomId,
        client.userId,
        data,
      );

      this.server.to(`room:${data.roomId}`).emit('video_state_updated', {
        videoState,
        action: 'change',
        userId: client.userId,
      });

      this.logger.log(
        `User ${client.userId} changed video to ${data.videoId} in room ${data.roomId}`,
      );

      return { success: true, videoState };
    } catch (error) {
      this.logger.error(
        `Error changing video in room ${data.roomId}`,
        error,
      );
      return {
        error: error instanceof Error ? error.message : 'Failed to change video',
      };
    }
  }

  @SubscribeMessage('playback_rate_change')
  async handlePlaybackRateChange(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: PlaybackRateChangeDto,
  ) {
    try {
      if (!client.userId) {
        return { error: 'Not authenticated' };
      }

      const canControl = await this.videoSyncService.canControlVideo(
        data.roomId,
        client.userId,
      );

      if (!canControl) {
        throw new ForbiddenException(
          'Only host and moderators can change playback rate',
        );
      }

      const videoState = await this.videoSyncService.changePlaybackRate(
        data.roomId,
        client.userId,
        data.rate,
      );

      this.server.to(`room:${data.roomId}`).emit('video_state_updated', {
        videoState,
        action: 'playback_rate_change',
        userId: client.userId,
      });

      this.logger.log(
        `User ${client.userId} changed playback rate to ${data.rate} in room ${data.roomId}`,
      );

      return { success: true, videoState };
    } catch (error) {
      this.logger.error(
        `Error changing playback rate in room ${data.roomId}`,
        error,
      );
      return {
        error: error instanceof Error ? error.message : 'Failed to change playback rate',
      };
    }
  }

  @SubscribeMessage('sync_request')
  async handleSyncRequest(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: SyncRequestDto,
  ) {
    try {
      if (!client.userId) {
        return { error: 'Not authenticated' };
      }

      await this.videoSyncService.validateRoomMember(
        data.roomId,
        client.userId,
      );

      const videoState = await this.videoSyncService.getVideoState(
        data.roomId,
      );

      if (!videoState) {
        return {
          success: true,
          videoState: null,
        };
      }

      this.logger.log(
        `User ${client.userId} requested sync for room ${data.roomId}`,
      );

      return {
        success: true,
        videoState,
      };
    } catch (error) {
      this.logger.error(
        `Error handling sync request for room ${data.roomId}`,
        error,
      );
      return {
        error: error instanceof Error ? error.message : 'Failed to sync',
      };
    }
  }
}
