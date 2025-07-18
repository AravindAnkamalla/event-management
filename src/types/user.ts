export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export enum UserInvitationStatus {
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}
export interface User {
  id: number;
  username: string;
  email: string;
  mobile: string;
  role: UserRole;
  invitation: UserInvitationStatus;
  createdBy: UserRole;
  createdAt: string;
  updatedBy: UserRole;
  updatedAt: string;
  isFirstLogin: boolean;
}
