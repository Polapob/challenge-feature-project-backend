import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SPOTIFY_BASE_URL } from './const';
import {
  ISpotifyAccessAndRefreshToken,
  ISpotifyRefreshAccessToken,
} from './type';
import { createURLWithQuery, generateRandomString } from './utils';

interface ISpotifyService {
  createSpotifyOAuthURL: () => void;
  getAccessAndRefreshToken: (
    loginCode: string,
    loginState: string,
  ) => Promise<ISpotifyAccessAndRefreshToken>;
  refreshAccessToken: (refreshToken: string) => Promise<any>;
}

@Injectable()
export class SpotifyService implements ISpotifyService {
  constructor(private readonly httpService: HttpService) {}
  createSpotifyOAuthURL() {
    const loginState = generateRandomString(16);
    const loginScope = 'user-read-private user-read-email';
    return createURLWithQuery(`${SPOTIFY_BASE_URL}/authorize?`, {
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      scope: loginScope,
      state: loginState,
    });
  }
  async getAccessAndRefreshToken(code: string) {
    const clientSecretBuffer = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
    ).toString('base64');
    const response =
      await this.httpService.axiosRef.post<ISpotifyAccessAndRefreshToken>(
        '/api/token',
        createURLWithQuery('', {
          grant_type: 'authorization_code',
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
          code,
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${clientSecretBuffer}`,
          },
        },
      );
    return response.data;
  }

  async refreshAccessToken(refreshToken: string) {
    const clientSecretBuffer = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
    ).toString('base64');
    const response =
      await this.httpService.axiosRef.post<ISpotifyRefreshAccessToken>(
        '/api/token',
        createURLWithQuery('', {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${clientSecretBuffer}`,
          },
        },
      );
    return response.data;
  }
}
