import { INotasRepository } from "@/application/repositories/INotasRepository";
import { Notas } from "@/domain/spdc/dto/notas";
import { FirebirdService } from "../services/firebird.service";
import { ICacheProvider } from "@/application/providers/ICacheProvider";
import { format } from "date-fns";

export class NotasRepository implements INotasRepository {
    constructor(
        private readonly firebirdService: FirebirdService,
        private readonly cacheProvider: ICacheProvider
    ) { }

    async listByCnpjAndDate(cnpj: string, date: string): Promise<Notas[]> {
        const currentDate = date.replaceAll('/', '.');

        const cacheKey = `notas${cnpj}:${currentDate}`;

        const cachedNotas = this.cacheProvider.get<Notas[] | null>(cacheKey);

        if (cachedNotas) {
            return cachedNotas
        }

        const sql = `SELECT DB_LISTA_XML_GERAL.iten,
                DB_LISTA_XML_GERAL.e_s,
                DB_LISTA_XML_GERAL.chave,
                DB_LISTA_XML_GERAL.modelo,
                DB_LISTA_XML_GERAL.serie,
                DB_LISTA_XML_GERAL.mes,
                DB_LISTA_XML_GERAL.total_nota,
                DB_LISTA_XML_GERAL.nota,
                DB_LISTA_XML_GERAL.data
            FROM DB_LISTA_XML_GERAL WHERE cnpj_nf = ?
                AND DB_LISTA_XML_GERAL.data = '${currentDate}'
        `;

        const result = await this.firebirdService.executeTransaction(sql, [cnpj]);

        this.cacheProvider.set(cacheKey, result, 3600);

        return result as Notas[];
    }
}