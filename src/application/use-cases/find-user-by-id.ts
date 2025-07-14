import { IUsersRepository } from "@/application/repositories/IUsersRepository";

export class FindUserById {
    constructor(private usersRepository: IUsersRepository) {}

    async execute(id: string) {
        return this.usersRepository.findById(id);
    }
}