import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

type DemoUser = {
  id: string;
  email: string;
  password: string;
  roles: string[];
};

@Injectable()
export class AuthService {
  private users: DemoUser[] = [
    {
      id: "u1",
      email: "admin@demo.com",
      password: "admin123",
      roles: ["admin"],
    },
    { id: "u2", email: "user@demo.com", password: "user123", roles: ["user"] },
  ];

  constructor(private jwt: JwtService) {}

  async login(email: string, password: string) {
    const user = this.users.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = await this.jwt.signAsync(payload);

    return { accessToken };
  }

  getUserById(id: string) {
    const u = this.users.find((x) => x.id === id);
    if (!u) return null;
    return { id: u.id, email: u.email, roles: u.roles };
  }
}
