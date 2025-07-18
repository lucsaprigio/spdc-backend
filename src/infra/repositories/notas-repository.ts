import { INotasRepository } from "@/application/repositories/INotasRepository";
import { Count, Notas } from "@/domain/spdc/dto/notas";
import { FirebirdService } from "../services/firebird.service";
import { ICacheProvider } from "@/application/providers/ICacheProvider";
import { ChartData, transformToChartData } from "@/core/shared/utils/transformToChartData";
import { NfeSearchParams, NfeResponse, TotalByPeriodResponse, TotalsByPeriodParams, CountResponse } from "@/domain/spdc/types/nfe-filters";

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

    async findByFilters(params: NfeSearchParams): Promise<NfeResponse | null> {
        try {
            const [data, count, totals] = await Promise.all([
                this.findData(params),
                this.countByStatus(params),
                this.getTotalsByPeriod(params)
            ])

            const calculated = this.calculatedTotals(totals, count[0].COUNT);

            return {
                data,
                count,
                totals,
                calculatedTotals: calculated
            }
        } catch (error) {
            console.log(error);
            throw new Error('Erro ao consultar banco de dados.');
        }
    }

    private countByStatus({ cnpj, type, initialDate, finalDate, e_s }: NfeSearchParams): Promise<CountResponse[]> {
        let sql = `
                SELECT COUNT(*) FROM DB_LISTA_XML_GERAL
                WHERE DB_LISTA_XML_GERAL.cnpj_nf = '${cnpj}'
                AND E_S = '${e_s}'
                AND MODELO = ${type}
                AND DB_LISTA_XML_GERAL.EMISSAO_SEFAZ BETWEEN 
                '${initialDate} 00:00:00' AND '${finalDate} 23:59:59'
            `;

        if (e_s === 'E') {
            sql += ` AND DB_LISTA_XML_GERAL.INTEGRIDADE <> 2`
        }

        return this.firebirdService.executeTransaction<CountResponse[]>(sql, []);
    }

    private getTotalsByPeriod(params: NfeSearchParams) {
        let sql = `
                SELECT DB_LISTA_XML_GERAL.NOTA, DB_LISTA_XML_GERAL.STATUS,
                SUM(COALESCE(DB_LISTA_XML_GERAL.total_nota, 0)) as total_nota
                FROM DB_LISTA_XML_GERAL WHERE cnpj_nf = '${params.cnpj}'
                AND E_S = '${params.e_s}'
                AND MODELO = ${params.type}
                AND DB_LISTA_XML_GERAL.EMISSAO_SEFAZ BETWEEN '${params.initialDate} 00:00:00' AND '${params.finalDate} 23:59:59'
        `;
        if (params.e_s === 'E') {
            `AND DB_LISTA_XML_GERAL.INTEGRIDADE <> 2 `
        }

        if (params.serieNf) {
            sql += ` AND serie = ${params.serieNf}`;
        }

        if (params.numberNf) {
            sql += ` AND NOTA = ${params.numberNf}`;
        }

        if (params.razaoNf) {
            sql += `AND RAZAO_SOCIAL LIKE '%${params.razaoNf.replace(/\+/g, ' ')}%'`
        }

        sql += `GROUP BY DB_LISTA_XML_GERAL.NOTA, DB_LISTA_XML_GERAL.STATUS`;

        return this.firebirdService.executeTransaction(sql, []);
    }

    private findData(params: NfeSearchParams) {
        const pageSize = 20;

        const offset = (params.page - 1) * pageSize

        let sql = `
           SELECT FIRST ${pageSize} SKIP ${offset}
                DISTINCT DB_LISTA_XML_GERAL.nota,
                COALESCE(COUNT(*), 0) AS total_count,
                DB_LISTA_XML_GERAL.e_s,
                DB_LISTA_XML_GERAL.chave,
                DB_LISTA_XML_GERAL.modelo,
                COALESCE(DB_LISTA_XML_GERAL.serie, 0) as serie,
                COALESCE(DB_LISTA_XML_GERAL.mes, 0) as mes,
                COALESCE(DB_LISTA_XML_GERAL.total_nota, 0) total_nota,
                DB_LISTA_XML_GERAL.EMISSAO_SEFAZ,
                DB_LISTA_XML_GERAL.status,
                DB_LISTA_XML_GERAL.DATA,
                COALESCE(DB_LISTA_XML_GERAL.RAZAO_SOCIAL, 'Não identificado') as RAZAO_SOCIAL
            FROM DB_LISTA_XML_GERAL
            WHERE cnpj_nf = '${params.cnpj}'
                AND E_S = '${params.e_s}'
                AND MODELO = ${params.type}
                AND DB_LISTA_XML_GERAL.EMISSAO_SEFAZ BETWEEN '${params.initialDate} 00:00:00' AND '${params.finalDate} 23:59:59'
        `;

        if (params.e_s === 'E') {
            sql += `AND DB_LISTA_XML_GERAL.INTEGRIDADE <> 2`
        }

        if (params.serieNf) {
            sql += ` AND serie = ${params.serieNf}`;
        }

        if (params.numberNf) {
            sql += ` AND NOTA = ${params.numberNf}`;
        }

        if (params.razaoNf) {
            sql += `AND RAZAO_SOCIAL LIKE '%${params.razaoNf.replace(/\+/g, ' ')}%'`
        }

        sql += `
            GROUP BY
                DB_LISTA_XML_GERAL.e_s,
                DB_LISTA_XML_GERAL.chave,
                DB_LISTA_XML_GERAL.modelo,
                DB_LISTA_XML_GERAL.nota,
                DB_LISTA_XML_GERAL.EMISSAO_SEFAZ,
                DB_LISTA_XML_GERAL.serie,
                DB_LISTA_XML_GERAL.mes,
                DB_LISTA_XML_GERAL.total_nota,
                DB_LISTA_XML_GERAL.status,
                DB_LISTA_XML_GERAL.RAZAO_SOCIAL,
                DB_LISTA_XML_GERAL.DATA
            ORDER BY DB_LISTA_XML_GERAL.nota
        `;

        return this.firebirdService.executeTransaction(sql, []);
    }

    private calculatedTotals(total: TotalByPeriodResponse[], totalCount: number, pageSize = 20) {
        const totalAut = parseFloat(total
            .filter(item => item.STATUS === 'A')
            .reduce((acc, item) => acc + item.TOTAL_NOTA, 0)
            .toFixed(2)
        )

        const totalCanc = parseFloat(total
            .filter(item => item.STATUS === 'C')
            .reduce((acc, item) => acc + item.TOTAL_NOTA, 0)
            .toFixed(2)
        )

        const countAut = total.filter(item => item.STATUS === 'A').length;
        const countCanc = total.filter(item => item.STATUS === 'C').length;

        const pageCount = Math.ceil(totalCount / pageSize);

        return {
            totalAut,
            totalCanc,
            countAut,
            countCanc,
            pageCount
        }
    }
}