import { NfeSearchParams, NfeResponse } from "@/domain/spdc/types/nfe-filters";
import { Notas } from "@/domain/spdc/dto/notas";

export interface INotasRepository {
    listByCnpjAndDate(cnpj: string, date: string): Promise<Notas[]>;
    countByCnpjPerDay(cnpj: string, day: string, dayAgo: number): Promise<any[]>;
    findByFilters(params: NfeSearchParams): Promise<NfeResponse | null>;
    downloadXmlByChave(chave: string): Promise<{ file: string }>;
    heelsReport(cnpj: string, cnpjFilial: string, month: string, year: string): Promise<{ heel: string | null }>;
}