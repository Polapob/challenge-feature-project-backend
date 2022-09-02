import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SPOTIFY_BASE_URL } from './const';
import { SpotifyService } from './spotify.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      baseURL: SPOTIFY_BASE_URL,
    }),
  ],
  providers: [SpotifyService],
  exports: [SpotifyService],
})
export class SpotifyModule {}
