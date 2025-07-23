import { NotasRepository } from "@/infra/repositories/notas-repository";

interface CountNotasByCnpjUseCaseRequest {
    cnpj: string;
    day: string;
    dayAgo: number;
}

export class CountNotasByCnpjUseCase {
    constructor(private notasRepository: NotasRepository) { }

    async execute({ cnpj, day, dayAgo }: CountNotasByCnpjUseCaseRequest) {
        return this.notasRepository.countByCnpjPerDay(cnpj, day, dayAgo);
    }
}