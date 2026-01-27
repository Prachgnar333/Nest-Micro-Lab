import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { IsEmail, IsString, MinLength } from "class-validator";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(4) password: string;
}

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  // Gateway calls this endpoint to validate token
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Req() req: any) {
    return { user: req.user }; // req.user comes from JwtStrategy.validate()
  }
}
