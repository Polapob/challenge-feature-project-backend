import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Module({
  imports: [SpotifyModule],
  controllers: [AuthController],
  providers: [],
  exports: [AuthModule],
})
export class AuthModule {}
