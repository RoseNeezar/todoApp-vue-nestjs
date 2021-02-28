export interface JwtPayload {
  userId: string;
  tokenVersion: number;
  exp: number;
}
