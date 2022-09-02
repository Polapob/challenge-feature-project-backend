import {
  Controller,
  Get,
  HttpStatus,
  Injectable,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { SpotifyService } from 'src/spotify/spotify.service';
import { ONE_HOUR_IN_SECOND, ONE_MONTH_IN_SECOND } from './const';
import { InvalidRefreshTokenException } from './exceptions/invalidRefreshToken.exception';
import { QueryErrorException } from './exceptions/queryError.exception';
import { IAuthCallbackQuery } from './interfaces/query';

interface IAuthController {
  redirectToSpotifyOAuth: (response: Response) => Promise<void>;
  refreshAccessToken: (request: Request, response: Response) => Promise<void>;
  getAccessAndRefreshToken: (
    response: Response,
    query: IAuthCallbackQuery,
  ) => Promise<void>;
}
@Injectable()
@Controller('auth')
export class AuthController implements IAuthController {
  constructor(private readonly spotifyService: SpotifyService) {}
  @Get('/login')
  async redirectToSpotifyOAuth(@Res() response: Response) {
    response.redirect(this.spotifyService.createSpotifyOAuthURL());
  }
  @Get('/callback')
  async getAccessAndRefreshToken(
    @Res() response: Response,
    @Query() query: IAuthCallbackQuery,
  ) {
    const { state, code } = query;
    if (!state || !code) {
      throw new QueryErrorException();
    }

    const { access_token, refresh_token } =
      await this.spotifyService.getAccessAndRefreshToken(code);

    response.cookie('access_token', access_token, {
      secure: true,
      httpOnly: true,
      maxAge: ONE_HOUR_IN_SECOND,
    });

    response.cookie('refresh_token', refresh_token, {
      secure: true,
      httpOnly: true,
      maxAge: ONE_MONTH_IN_SECOND,
    });

    response
      .status(HttpStatus.ACCEPTED)
      .send({ refreshToken: refresh_token, accessToken: access_token });
  }
  @Post('/refresh')
  async refreshAccessToken(@Req() request: Request, @Res() response: Response) {
    const { refresh_token } = request.cookies;
    console.log('refreshToken =', refresh_token);

    if (!refresh_token) {
      throw new InvalidRefreshTokenException();
    }

    const { access_token } = await this.spotifyService.refreshAccessToken(
      refresh_token,
    );
    response.cookie('access_token', access_token, {
      secure: true,
      httpOnly: true,
      maxAge: ONE_HOUR_IN_SECOND,
    });
    response.status(HttpStatus.ACCEPTED).send({ access_token: access_token });
  }
}
