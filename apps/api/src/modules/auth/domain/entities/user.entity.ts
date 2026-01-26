import { Entity, EntityProps } from '@/shared/domain/entity.base';

export interface UserRole {
  id: string;
  role: {
    id: string;
    name: string;
    description: string | null;
  };
}

export interface UserProps extends EntityProps {
  email: string;
  passwordHash: string;
  isActive: boolean;
  roles?: UserRole[];
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps) {
    super(props);
  }

  static create(props: UserProps): User {
    return new User(props);
  }

  get email(): string {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get roles(): UserRole[] {
    return this.props.roles || [];
  }

  hasRole(roleName: string): boolean {
    return this.roles.some((userRole) => userRole.role.name === roleName);
  }

  getRoleNames(): string[] {
    return this.roles.map((userRole) => userRole.role.name);
  }
}

