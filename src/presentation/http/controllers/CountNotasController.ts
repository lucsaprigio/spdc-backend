import { IController } from "@/application/repositories/IController";
import { CountNotasByCnpjUseCase } from "@/application/use-cases/count-notas-by-cnpj";

export class CountNotasController implements IController<{ cnpj: string; day: string, dayAgo: number }, any[]> {
    constructor(
        private countNotasByCnpjUseCase: CountNotasByCnpjUseCase,
    ) { }

    async handle(request: { cnpj: string, day: string, dayAgo: number }) {
        return this.countNotasByCnpjUseCase.execute(request);
    }
}