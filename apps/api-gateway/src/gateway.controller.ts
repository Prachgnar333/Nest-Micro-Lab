import {
  All,
  Controller,
  Req,
  Res,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy.service';
import { AuthIntrospectionService } from './auth-introspection.service';
import { randomUUID } from 'crypto';

@Controller('api')
export class GatewayController {
  private logger = new Logger('GatewayController');

  constructor(
    private config: ConfigService,
    private proxy: ProxyService,
    private auth: AuthIntrospectionService,
  ) {}

  @All('*')
  async routeAll(@Req() req: Request, @Res() res: Response) {
    // --- Gateway Feature 1: Request ID propagation
    const requestId = (req.headers['x-request-id'] as string) ?? randomUUID();
    const startTime = Date.now();

    // Example paths:
    // /api/auth/login
    // /api/orders
    // /api/orders/123

    const full = req.originalUrl; // includes query
    const pathOnly = req.path; // without query
    const afterApi = pathOnly.replace(/^\/api\//, ''); // e.g. "orders/123"

    const [serviceKey, ...rest] = afterApi.split('/');
    const forwardPath = '/' + rest.join('/'); // e.g. "/123" or "/"

    const route = this.resolveRoute(serviceKey);
    if (!route) {
      this.logger.warn(
        `Unknown route: ${serviceKey} (request-id: ${requestId})`,
      );
      return res.status(404).json({ message: `Unknown route: ${serviceKey}` });
    }

    // --- Gateway Feature 2: Authentication enforcement (for protected routes)
    let user: any = null;
    const authHeader = req.headers['authorization'] as string | undefined;

    // Allow public access to health endpoints
    const isHealthCheck =
      forwardPath.endsWith('/health') || forwardPath === '/health';

    if (route.protected && !isHealthCheck) {
      const token = this.auth.extractBearerToken(authHeader);
      if (!token) throw new UnauthorizedException('Missing Bearer token');

      const payload = await this.auth.validate(token);
      user = payload.user ?? payload;
    }

    // --- Gateway Feature 3: Forward request to target service
    const upstream = await this.proxy.forward({
      baseUrl: route.baseUrl,
      method: req.method,
      path: route.path + forwardPath,
      headers: {
        ...req.headers,
        'x-request-id': requestId, // Propagate request ID
        // --- Gateway Feature 4: propagate identity for internal services
        ...(user
          ? {
              'x-user-id': user.id,
              'x-user-email': user.email,
              'x-user-roles': JSON.stringify(user.roles ?? []),
            }
          : {}),
      },
      query: req.query,
      body: req.body,
    });

    // --- Gateway Feature 5: basic response pass-through with logging
    const duration = Date.now() - startTime;
    this.logger.log(
      `${req.method} ${pathOnly} → ${serviceKey} [${upstream.status}] ${duration}ms (request-id: ${requestId})`,
    );

    res.status(upstream.status);
    return res.send(upstream.data);
  }

  private resolveRoute(
    serviceKey: string,
  ): null | { baseUrl: string; protected: boolean; path: string } {
    switch (serviceKey) {
      case 'auth':
        return {
          baseUrl: this.config.get<string>('AUTH_SERVICE_URL')!,
          path: '/auth',
          protected: false,
        };
      case 'orders':
        return {
          baseUrl: this.config.get<string>('ORDER_SERVICE_URL')!,
          path: '/orders',
          protected: true,
        };
      default:
        return null;
    }
  }
}
