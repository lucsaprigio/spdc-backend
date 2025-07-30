import { AppError } from "@/core/shared/errors/AppError";
import { INotasRepository } from "../repositories/INotasRepository";

export interface HeelsReportRequest {
    cnpj: string,
    cnpjFilial: string,
    month: string,
    year: string
}

export interface HeelsReportResponse {
    heel: string;
}

export class HeelsReportUseCase {
    constructor(private notasRepository: INotasRepository) { }

    async execute(request: HeelsReportRequest): Promise<HeelsReportResponse> {
        const { cnpj, cnpjFilial, month, year } = request;

        if (!cnpj || !cnpjFilial) {
            throw new AppError("CNPJ ou CNPJ Filial não informados.", 400);
        }

        const blob = await this.notasRepository.heelsReport(cnpj, cnpjFilial, month, year);

        const decoded = Buffer
            .from(blob.heel, 'binary')
            .toString('utf8')
            .replace(/\r\n/g, '<br/>')
            .replace(/ {2}/g, '&nbsp;&nbsp;');

        return {
            heel: decoded
        }
    }
}