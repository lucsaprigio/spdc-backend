import { INotasRepository } from "../repositories/INotasRepository";

export class DownloadXmlByChaveUseCase {
    constructor(private readonly notasRepository: INotasRepository) { };

    async execute(chave: string) {
        return this.notasRepository.downloadXmlByChave(chave);
    }
}