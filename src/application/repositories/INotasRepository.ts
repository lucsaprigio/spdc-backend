import { IListByCnpjAndDateResponseDTO } from "@/domain/spdc/dto/notas";

export interface INotasRepository {
    listByCnpjAndDate(cnpj: string, date: Date): Promise<IListByCnpjAndDateResponseDTO>
}