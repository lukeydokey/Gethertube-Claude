import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { RoomRole } from '@prisma/client';
import { VideoSyncService } from './video-sync.service';
import { PrismaService } from '@/database/prisma.service';

describe('VideoSyncService', () => {
  let service: VideoSyncService;
  let prisma: any;

  const mockVideoState = {
    id: 'video-state-1',
    roomId: 'room-1',
    videoId: 'dQw4w9WgXcQ',
    videoTitle: 'Test Video',
    videoThumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg',
    currentTime: 42.5,
    isPlaying: true,
    playbackRate: 1.0,
    lastUpdated: new Date('2026-01-21T10:00:00.000Z'),
  };

  const mockRoomMember = {
    id: 'member-1',
    roomId: 'room-1',
    userId: 'user-1',
    role: RoomRole.HOST,
    joinedAt: new Date(),
  };

  beforeEach(async () => {
    prisma = {
      videoState: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      roomMember: {
        findFirst: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoSyncService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<VideoSyncService>(VideoSyncService);
  });

  describe('getVideoState', () => {
    it('should return video state when found', async () => {
      prisma.videoState.findUnique.mockResolvedValue(mockVideoState);

      const result = await service.getVideoState('room-1');

      expect(result).toEqual({
        roomId: 'room-1',
        videoId: 'dQw4w9WgXcQ',
        videoTitle: 'Test Video',
        videoThumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg',
        currentTime: 42.5,
        isPlaying: true,
        playbackRate: 1.0,
        lastUpdated: mockVideoState.lastUpdated,
      });
      expect(prisma.videoState.findUnique).toHaveBeenCalledWith({
        where: { roomId: 'room-1' },
      });
    });

    it('should return null when video state not found', async () => {
      prisma.videoState.findUnique.mockResolvedValue(null);

      const result = await service.getVideoState('room-1');

      expect(result).toBeNull();
    });
  });

  describe('createVideoState', () => {
    it('should create new video state', async () => {
      const newVideoState = {
        id: 'video-state-1',
        roomId: 'room-1',
        videoId: null,
        videoTitle: null,
        videoThumbnail: null,
        currentTime: 0,
        isPlaying: false,
        playbackRate: 1.0,
        lastUpdated: new Date(),
      };

      prisma.videoState.findUnique.mockResolvedValue(null);
      prisma.videoState.create.mockResolvedValue(newVideoState);

      const result = await service.createVideoState('room-1');

      expect(result).toEqual(newVideoState);
      expect(prisma.videoState.create).toHaveBeenCalledWith({
        data: {
          roomId: 'room-1',
          currentTime: 0,
          isPlaying: false,
          playbackRate: 1.0,
        },
      });
    });

    it('should return existing video state if already exists', async () => {
      prisma.videoState.findUnique.mockResolvedValue(mockVideoState);

      const result = await service.createVideoState('room-1');

      expect(result).toEqual(mockVideoState);
      expect(prisma.videoState.create).not.toHaveBeenCalled();
    });
  });

  describe('playVideo', () => {
    it('should update video state to playing', async () => {
      const updatedState = { ...mockVideoState, isPlaying: true, currentTime: 50 };

      prisma.roomMember.findFirst.mockResolvedValue(mockRoomMember);
      prisma.videoState.findUnique.mockResolvedValue(mockVideoState);
      prisma.videoState.update.mockResolvedValue(updatedState);

      const result = await service.playVideo('room-1', 'user-1', 50);

      expect(result.isPlaying).toBe(true);
      expect(result.currentTime).toBe(50);
      expect(prisma.videoState.update).toHaveBeenCalledWith({
        where: { roomId: 'room-1' },
        data: {
          isPlaying: true,
          currentTime: 50,
          lastUpdated: expect.any(Date),
        },
      });
    });

    it('should throw ForbiddenException if user is not a member', async () => {
      prisma.roomMember.findFirst.mockResolvedValue(null);

      await expect(
        service.playVideo('room-1', 'user-1', 50),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if video state not found', async () => {
      prisma.roomMember.findFirst.mockResolvedValue(mockRoomMember);
      prisma.videoState.findUnique.mockResolvedValue(null);

      await expect(
        service.playVideo('room-1', 'user-1', 50),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('pauseVideo', () => {
    it('should update video state to paused', async () => {
      const updatedState = { ...mockVideoState, isPlaying: false, currentTime: 60 };

      prisma.roomMember.findFirst.mockResolvedValue(mockRoomMember);
      prisma.videoState.findUnique.mockResolvedValue(mockVideoState);
      prisma.videoState.update.mockResolvedValue(updatedState);

      const result = await service.pauseVideo('room-1', 'user-1', 60);

      expect(result.isPlaying).toBe(false);
      expect(result.currentTime).toBe(60);
    });
  });

  describe('seekVideo', () => {
    it('should update current time', async () => {
      const updatedState = { ...mockVideoState, currentTime: 120 };

      prisma.roomMember.findFirst.mockResolvedValue(mockRoomMember);
      prisma.videoState.findUnique.mockResolvedValue(mockVideoState);
      prisma.videoState.update.mockResolvedValue(updatedState);

      const result = await service.seekVideo('room-1', 'user-1', 120);

      expect(result.currentTime).toBe(120);
    });
  });

  describe('changeVideo', () => {
    it('should change to new video', async () => {
      const newVideoData = {
        roomId: 'room-1',
        videoId: 'newVideoId',
        videoTitle: 'New Video',
        videoThumbnail: 'https://example.com/thumb.jpg',
      };

      const updatedState = {
        ...mockVideoState,
        videoId: 'newVideoId',
        videoTitle: 'New Video',
        videoThumbnail: 'https://example.com/thumb.jpg',
        currentTime: 0,
        isPlaying: false,
      };

      prisma.roomMember.findFirst.mockResolvedValue(mockRoomMember);
      prisma.videoState.findUnique.mockResolvedValue(mockVideoState);
      prisma.videoState.update.mockResolvedValue(updatedState);

      const result = await service.changeVideo('room-1', 'user-1', newVideoData);

      expect(result.videoId).toBe('newVideoId');
      expect(result.currentTime).toBe(0);
      expect(result.isPlaying).toBe(false);
    });
  });

  describe('changePlaybackRate', () => {
    it('should update playback rate', async () => {
      const updatedState = { ...mockVideoState, playbackRate: 1.5 };

      prisma.roomMember.findFirst.mockResolvedValue(mockRoomMember);
      prisma.videoState.findUnique.mockResolvedValue(mockVideoState);
      prisma.videoState.update.mockResolvedValue(updatedState);

      const result = await service.changePlaybackRate('room-1', 'user-1', 1.5);

      expect(result.playbackRate).toBe(1.5);
    });
  });

  describe('canControlVideo', () => {
    it('should return true for HOST', async () => {
      prisma.roomMember.findFirst.mockResolvedValue({
        ...mockRoomMember,
        role: RoomRole.HOST,
      });

      const result = await service.canControlVideo('room-1', 'user-1');

      expect(result).toBe(true);
    });

    it('should return true for MODERATOR', async () => {
      prisma.roomMember.findFirst.mockResolvedValue({
        ...mockRoomMember,
        role: RoomRole.MODERATOR,
      });

      const result = await service.canControlVideo('room-1', 'user-1');

      expect(result).toBe(true);
    });

    it('should return false for MEMBER', async () => {
      prisma.roomMember.findFirst.mockResolvedValue({
        ...mockRoomMember,
        role: RoomRole.MEMBER,
      });

      const result = await service.canControlVideo('room-1', 'user-1');

      expect(result).toBe(false);
    });

    it('should return false if not a member', async () => {
      prisma.roomMember.findFirst.mockResolvedValue(null);

      const result = await service.canControlVideo('room-1', 'user-1');

      expect(result).toBe(false);
    });
  });

  describe('validateRoomMember', () => {
    it('should not throw if user is a member', async () => {
      prisma.roomMember.findFirst.mockResolvedValue(mockRoomMember);

      await expect(
        service.validateRoomMember('room-1', 'user-1'),
      ).resolves.not.toThrow();
    });

    it('should throw ForbiddenException if user is not a member', async () => {
      prisma.roomMember.findFirst.mockResolvedValue(null);

      await expect(
        service.validateRoomMember('room-1', 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
