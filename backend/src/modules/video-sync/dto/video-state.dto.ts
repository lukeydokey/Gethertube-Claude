import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VideoStateDto {
  @ApiProperty({
    description: 'YouTube video ID',
    example: 'dQw4w9WgXcQ',
  })
  @IsString()
  @IsOptional()
  videoId?: string;

  @ApiPropertyOptional({
    description: 'Video title',
    example: 'Rick Astley - Never Gonna Give You Up',
  })
  @IsString()
  @IsOptional()
  videoTitle?: string;

  @ApiPropertyOptional({
    description: 'Video thumbnail URL',
    example: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg',
  })
  @IsString()
  @IsOptional()
  videoThumbnail?: string;

  @ApiProperty({
    description: 'Current playback time in seconds',
    example: 42.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  currentTime: number;

  @ApiProperty({
    description: 'Whether the video is currently playing',
    example: true,
  })
  @IsBoolean()
  isPlaying: boolean;

  @ApiProperty({
    description: 'Playback rate (speed)',
    example: 1.0,
    minimum: 0.25,
    maximum: 2.0,
  })
  @IsNumber()
  @Min(0.25)
  @Max(2.0)
  @IsOptional()
  playbackRate?: number;
}

export class VideoStateResponseDto extends VideoStateDto {
  @ApiProperty({
    description: 'Room ID',
    example: 'clxyz123abc',
  })
  roomId: string;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2026-01-21T10:30:00.000Z',
  })
  lastUpdated: Date;
}
