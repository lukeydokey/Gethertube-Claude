import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { VideoSyncService } from './video-sync.service';
import { VideoSyncGateway } from './video-sync.gateway';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule, JwtModule],
  providers: [VideoSyncService, VideoSyncGateway],
  exports: [VideoSyncService],
})
export class VideoSyncModule {}
