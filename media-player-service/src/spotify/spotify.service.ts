import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { SPOTIFY_BASE_URL } from './const';
import {
  IGetAccessAndRefreshTokenDTO,
  IRefreshAccessToken,
  ISpotifyAccessAndRefreshToken,
  ISpotifyRefreshAccessToken,
} from './type';
import { createURLWithQuery, generateRandomString } from './utils';
import { AxiosError } from 'axios';

interface ISpotifyService {
  createSpotifyOAuthURL: () => void;
  getAccessAndRefreshToken: (
    loginCode: string,
    loginState: string,
  ) => Promise<IGetAccessAndRefreshTokenDTO>;
  refreshAccessToken: (refreshToken: string) => Promise<IRefreshAccessToken>;
}

@Injectable()
export class SpotifyService implements ISpotifyService {
  constructor(private readonly httpService: HttpService) {}
  createSpotifyOAuthURL() {
    const loginState = generateRandomString(16);
    const loginScope =
      'user-read-private user-read-email user-read-playback-state user-modify-playback-state';

    const login_url = createURLWithQuery(`${SPOTIFY_BASE_URL}/authorize?`, {
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      scope: loginScope,
      state: loginState,
    });

    return {
      login_url,
      status: HttpStatus.OK,
      errorMessage: '',
    };
  }
  async getAccessAndRefreshToken(code: string) {
    const clientSecretBuffer = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
    ).toString('base64');

    try {
      const {
        data: { access_token, refresh_token },
        status,
      } = await this.httpService.axiosRef.post<ISpotifyAccessAndRefreshToken>(
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
      return {
        access_token,
        refresh_token,
        status,
        errorMessage: '',
      };
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      return {
        access_token: '',
        refresh_token: '',
        status: error.response.status,
        errorMessage: error.response.data.error,
      };
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const clientSecretBuffer = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
    ).toString('base64');
    try {
      const {
        data: { access_token },
        status,
      } = await this.httpService.axiosRef.post<ISpotifyRefreshAccessToken>(
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
      return {
        access_token,
        status,
        errorMessage: '',
      };
    } catch (err) {
      const error = err as AxiosError<{ error: { message: string } }>;
      return {
        access_token: '',
        status: error.response.status,
        errorMessage: error.message,
      };
    }
  }
}
