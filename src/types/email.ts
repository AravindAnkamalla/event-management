export interface SendAccountCreatedEmailInput {
  username: string;
  email: string;
  password: string;
}
export interface SendAccountCreatedEmailResponse {
  msg: string;
  status: "success" | "error";
}
export interface SendOtpEmailInput {
  to: string;
  username: string;
  otp: string;
  expirationMinutes: number;
}
export interface SendOtpEmailResponse {
  msg: string;
}