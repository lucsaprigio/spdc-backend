import { IController } from "@/application/repositories/IController";
import { HeelsReportRequest, HeelsReportResponse, HeelsReportUseCase } from "@/application/use-cases/heels-report-use-case";

export class HeelsReportController implements IController<HeelsReportRequest, HeelsReportResponse> {
    constructor(
        private heelsReportUseCase: HeelsReportUseCase
    ) { }

    async handle(request: HeelsReportRequest) {
        return this.heelsReportUseCase.execute(request);
    }
}