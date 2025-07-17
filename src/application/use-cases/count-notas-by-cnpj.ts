import { NotasRepository } from "@/infra/repositories/notas-repository";

interface CountNotasByCnpjUseCaseRequest {
    cnpj: string;
    day: string;
}

export class CountNotasByCnpjUseCase {
    constructor(private notasRepository: NotasRepository) { }

    async execute({ cnpj, day }: CountNotasByCnpjUseCaseRequest) {
        return this.notasRepository.countByCnpjPerDay(cnpj, day);
    }
}