import { Notas } from "@/domain/spdc/dto/notas";

export interface INotasRepository {
    listByCnpjAndDate(cnpj: string, date: string): Promise<Notas[]>;
    countByCnpjPerDay(cnpj: string, day: string): Promise<any[]>
}