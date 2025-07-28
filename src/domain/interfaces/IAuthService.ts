import { User } from "@/domain/spdc/dto/users";

export interface IAuthService {
    login(user: User): Promise<{ token: string, users: User[] | null }>;
    validateToken?(token: string): Promise<any>;
}