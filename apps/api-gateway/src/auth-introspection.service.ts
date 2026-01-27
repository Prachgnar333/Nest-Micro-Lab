import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthIntrospectionService {
  constructor(
    private http: HttpService,
    private config: ConfigService,
  ) {}

  private get authUrl() {
    return this.config.get<string>('AUTH_SERVICE_URL')!;
  }

  extractBearerToken(authHeader?: string) {
    if (!authHeader?.startsWith('Bearer ')) return null;
    return authHeader.slice('Bearer '.length);
  }

  async validate(token: string) {
    try {
      const res = await firstValueFrom(
        this.http.get(`${this.authUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 4000,
        }),
      );
      return (res as any).data;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
