export interface IJwtPayload {
    CD_CLIENTE: number;
    EMAIL_CLIENTE: string;
    iat?: number;
    exp?: number;
}