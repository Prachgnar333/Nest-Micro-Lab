// Shared DTOs for authentication

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
}

export interface AuthPayload {
  sub: string;
  email: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export interface UserDto {
  id: string;
  email: string;
  roles: string[];
}
