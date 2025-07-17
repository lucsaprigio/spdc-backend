import { IController } from "@/application/repositories/IController";
import { CountNotasByCnpjUseCase } from "@/application/use-cases/count-notas-by-cnpj";

export class CountNotasController implements IController<{ cnpj: string; day: string }, any[]> {
    constructor(
        private countNotasByCnpjUseCase: CountNotasByCnpjUseCase,
    ) { }

    async handle(request: { cnpj: string, day: string }) {
        return this.countNotasByCnpjUseCase.execute(request);
    }
}