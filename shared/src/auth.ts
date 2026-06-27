export interface AuthLoginRequest {
  username: string;
  password: string;
  smsCode?: string;
}

export interface AuthLoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  userInfo: {
    id: number;
    username: string;
    name: string;
    roleId: number;
    roleName: string;
  };
}

export interface SendSmsRequest {
  phone: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}
