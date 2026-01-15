import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // This guard uses the 'jwt' strategy we defined in JwtStrategy
  // It will automatically:
  // 1. Extract JWT from Authorization header
  // 2. Verify the JWT signature
  // 3. Call JwtStrategy.validate()
  // 4. Attach the result to request.user
}