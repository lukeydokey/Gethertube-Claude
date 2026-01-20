import { IsString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SyncRequestDto {
  @ApiProperty({
    description: 'Room ID to request sync for',
    example: 'clxyz123abc',
  })
  @IsString()
  roomId: string;
}

export class VideoPlayDto {
  @ApiProperty({
    description: 'Room ID',
    example: 'clxyz123abc',
  })
  @IsString()
  roomId: string;

  @ApiProperty({
    description: 'Current time when play was triggered',
    example: 42.5,
  })
  @IsNumber()
  @Min(0)
  currentTime: number;
}

export class VideoPauseDto {
  @ApiProperty({
    description: 'Room ID',
    example: 'clxyz123abc',
  })
  @IsString()
  roomId: string;

  @ApiProperty({
    description: 'Current time when pause was triggered',
    example: 42.5,
  })
  @IsNumber()
  @Min(0)
  currentTime: number;
}

export class VideoSeekDto {
  @ApiProperty({
    description: 'Room ID',
    example: 'clxyz123abc',
  })
  @IsString()
  roomId: string;

  @ApiProperty({
    description: 'Target time to seek to',
    example: 120.0,
  })
  @IsNumber()
  @Min(0)
  currentTime: number;
}

export class VideoChangeDto {
  @ApiProperty({
    description: 'Room ID',
    example: 'clxyz123abc',
  })
  @IsString()
  roomId: string;

  @ApiProperty({
    description: 'New YouTube video ID',
    example: 'dQw4w9WgXcQ',
  })
  @IsString()
  videoId: string;

  @ApiProperty({
    description: 'Video title',
    example: 'Rick Astley - Never Gonna Give You Up',
    required: false,
  })
  @IsString()
  @IsOptional()
  videoTitle?: string;

  @ApiProperty({
    description: 'Video thumbnail URL',
    example: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  videoThumbnail?: string;
}

export class PlaybackRateChangeDto {
  @ApiProperty({
    description: 'Room ID',
    example: 'clxyz123abc',
  })
  @IsString()
  roomId: string;

  @ApiProperty({
    description: 'New playback rate',
    example: 1.5,
    minimum: 0.25,
    maximum: 2.0,
  })
  @IsNumber()
  @Min(0.25)
  @Max(2.0)
  rate: number;
}
