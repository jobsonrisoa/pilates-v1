import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'Health status' })
  status!: string;

  @ApiProperty({
    example: {
      database: { status: 'up' },
      storage: { status: 'up' },
      memory_heap: { status: 'up' },
    },
    description: 'Health check details',
    required: false,
  })
  info?: Record<string, any>;

  @ApiProperty({
    example: {
      database: { status: 'down', error: 'db_unreachable' },
    },
    description: 'Health check errors',
    required: false,
  })
  error?: Record<string, any>;
}
