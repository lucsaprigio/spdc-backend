import { INotasRepository } from "@/application/repositories/INotasRepository";
import { Count, Notas } from "@/domain/spdc/dto/notas";
import { FirebirdService } from "../services/firebird.service";
import { ICacheProvider } from "@/application/providers/ICacheProvider";
import { ChartData, transformToChartData } from "@/core/shared/utils/transformToChartData";

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
                COALESCE(DB_LISTA_XML_GERAL.mes, 0) as mes,
                COALESCE(DB_LISTA_XML_GERAL.total_nota, 0) AS total_nota,
                DB_LISTA_XML_GERAL.nota,
                DB_LISTA_XML_GERAL.data
            FROM DB_LISTA_XML_GERAL WHERE cnpj_nf = ?
                AND DB_LISTA_XML_GERAL.data = '${currentDate}'
        `;

        const result = await this.firebirdService.executeTransaction(sql, [cnpj]);

        this.cacheProvider.set(cacheKey, result, 3600);

        return result as Notas[];
    }

    async countByCnpjPerDay(cnpj: string, day: string) {
        const formattedDate = day.replaceAll('/', '.');

        const [dayPart, monthPart, yearPart] = day.split('/');
        const currentDate = new Date(`${yearPart}-${monthPart}-${dayPart}`);
        const sevenDaysAgo = new Date(currentDate);
        sevenDaysAgo.setDate(currentDate.getDate() - 8);
        const formattedSevenDaysAgo = `${sevenDaysAgo.getDate().toString().padStart(2, '0')}.${(sevenDaysAgo.getMonth() + 1).toString().padStart(2, '0')}.${sevenDaysAgo.getFullYear()}`;

        const cacheKey = `countNotas${cnpj}:${day}`;

        const cachedNotas = this.cacheProvider.get<ChartData[] | null>(cacheKey);
        if (cachedNotas) {
            return cachedNotas
        }

        const sql = `
                SELECT 
            COUNT(*) AS total,
            MODELO,
            EXTRACT(DAY FROM DTA_TRANS) || ' - ' || 
            CASE EXTRACT(MONTH FROM DTA_TRANS)
                WHEN 1 THEN 'JAN' WHEN 2 THEN 'FEV' WHEN 3 THEN 'MAR'
                WHEN 4 THEN 'ABR' WHEN 5 THEN 'MAI' WHEN 6 THEN 'JUN'
                WHEN 7 THEN 'JUL' WHEN 8 THEN 'AGO' WHEN 9 THEN 'SET'
                WHEN 10 THEN 'OUT' WHEN 11 THEN 'NOV' WHEN 12 THEN 'DEZ'
            END AS dia_mes
        FROM 
            DB_LISTA_XML_GERAL
        WHERE 
            CNPJ_NF = ?
            AND DTA_TRANS BETWEEN '${formattedSevenDaysAgo}' AND '${formattedDate}'
        GROUP BY 
            MODELO, 
            EXTRACT(DAY FROM DTA_TRANS),
            EXTRACT(MONTH FROM DTA_TRANS)
    `;

        try {
            // Executa a consulta no banco
            const result = await this.firebirdService.executeQuery<Count[]>(sql, [
                cnpj
            ]);

            const data = transformToChartData(result);

            // Armazena no cache (ex: por 1 hora)
            this.cacheProvider.set(cacheKey, data, 3600);

            return data;
        } catch (error) {
            console.error('Erro ao buscar notas:', error);
            throw new Error('Falha ao consultar o banco de dados.');
        }
    }
}