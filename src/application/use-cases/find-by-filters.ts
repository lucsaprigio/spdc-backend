import { NfeResponse, NfeSearchParams } from "@/domain/spdc/types/nfe-filters";
import { INotasRepository } from "../repositories/INotasRepository";

export class FindByFiltersUseCase {
    constructor(private notasRepository: INotasRepository) { }

    async execute(request: NfeSearchParams): Promise<NfeResponse | null> {
        return this.notasRepository.findByFilters(request);
    }
}