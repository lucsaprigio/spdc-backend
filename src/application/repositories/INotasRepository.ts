import { NfeSearchParams, NfeResponse, TotalsByPeriodParams, TotalByPeriodResponse } from "@/domain/spdc/types/nfe-filters";
import { Notas } from "@/domain/spdc/dto/notas";

export interface INotasRepository {
    listByCnpjAndDate(cnpj: string, date: string): Promise<Notas[]>;
    countByCnpjPerDay(cnpj: string, day: string): Promise<any[]>;
    findByFilters(params: NfeSearchParams): Promise<NfeResponse | null>;
}