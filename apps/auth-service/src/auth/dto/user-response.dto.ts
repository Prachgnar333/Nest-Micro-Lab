export class UserResponseDto {
  id: number;
  email: string;
  isActive: boolean;
  roles: string[];
  permissions: string[];
}