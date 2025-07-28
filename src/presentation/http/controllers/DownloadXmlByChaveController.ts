import { IController } from "@/application/repositories/IController";
import { DownloadXmlByChaveUseCase } from "@/application/use-cases/download-xml-by-chave-use-case";
import * as zlib from 'node:zlib';

export class DownloadXmlByChaveController implements IController<{ chave: string }, { file: string }> {
    constructor(
        private downloadXmlByChaveUseCase: DownloadXmlByChaveUseCase
    ) { }

    async handle(request: { chave: string }) {
        const { chave } = request;

        const xmlString = await this.downloadXmlByChaveUseCase.execute(chave);

        const xmlBuffer = Buffer.from(xmlString.file, 'binary');

        const desconpressedXml = zlib.unzipSync(xmlBuffer);

        return {
            file: desconpressedXml.toString('utf8')
        }
    }
}       