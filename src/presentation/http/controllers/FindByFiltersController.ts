import { IController } from "@/application/repositories/IController";
import { FindByFiltersUseCase } from "@/application/use-cases/find-by-filters";
import { NfeResponse, NfeSearchParams } from "@/domain/spdc/types/nfe-filters";

export class FindByFiltersController implements IController<NfeSearchParams, NfeResponse> {
    constructor(
        private findByFiltersUseCase: FindByFiltersUseCase
    ) { }

    async handle(request: NfeSearchParams): Promise<NfeResponse | null> {
        return this.findByFiltersUseCase.execute(request);
    }
}