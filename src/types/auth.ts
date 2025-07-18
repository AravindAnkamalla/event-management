import { User } from "./user";

export interface LoginInput {
  email: string;
  password: string;
}
export interface LoginResponse {
  user: User
  accessToken: string;
  refreshToken: string;
}
