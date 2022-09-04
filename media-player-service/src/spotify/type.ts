export type ResponseType = {
  status: number;
  errorMessage: string;
};
export interface ISpotifyAccessAndRefreshToken {
  access_token: string;
  token_string: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
}

export interface ISpotifyRefreshAccessToken {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}

export interface IGetAccessAndRefreshTokenDTO extends ResponseType {
  access_token: string;
  refresh_token: string;
}

export type IRefreshAccessToken = Omit<
  IGetAccessAndRefreshTokenDTO,
  'refresh_token'
>;

export interface IGenerateSpotifyLoginURL extends ResponseType {
  login_url: string;
}
