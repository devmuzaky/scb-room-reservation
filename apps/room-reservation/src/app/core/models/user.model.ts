export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

// TODO: Add more roles as needed like BLOCKED
export enum UserStatus {
  ACTIVATED = 'activated',
  NOT_ACTIVATED = 'not_activated',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  failedLoginAttempts?: number;
  blockedUntil?: string;
}
