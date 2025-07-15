import { Notas } from "@/domain/spdc/dto/notas";
import { INotasRepository } from "../repositories/INotasRepository";

interface ListNotasByCnpjDateUseCaseRequest {
    cnpj: string;
    date: string;
}

export class ListNotasByCnpjDateUseCase {
    constructor(private notasRepository: INotasRepository) { }

    async execute({ cnpj, date }: ListNotasByCnpjDateUseCaseRequest): Promise<Notas[]> {
        const notas = this.notasRepository.listByCnpjAndDate(cnpj, date);

        return notas;
    }
}