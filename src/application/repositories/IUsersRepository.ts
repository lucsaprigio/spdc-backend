import { User } from "@/domain/spdc/dto/users";

export interface IUsersRepository  {
    findById(id: string): Promise<User[] | null>;
    findByEmail(email: string): Promise<User[] | null>;
}