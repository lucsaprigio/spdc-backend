import { IController } from "@/application/repositories/IController";
import { ListNotasByCnpjDateUseCase } from "@/application/use-cases/list-notas-by-cnpj-date";
import { Notas } from "@/domain/spdc/dto/notas";

export class ListNotasController implements IController<{ cnpj: string; date: string }, Notas[]> {
    constructor(
        private listNotasByCnpjDateUseCase: ListNotasByCnpjDateUseCase
    ) { }

    async handle(request: { cnpj: string, date: string }): Promise<Notas[]> {
        return this.listNotasByCnpjDateUseCase.execute(request);
    }
}