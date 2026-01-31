import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'admin@pilates.com' })
  email!: string;

  @ApiProperty({ example: ['SUPER_ADMIN'] })
  roles!: string[];

  @ApiProperty({ example: ['students:read', 'users:create'], required: false })
  permissions?: string[];
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;
}
