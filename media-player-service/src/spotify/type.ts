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
