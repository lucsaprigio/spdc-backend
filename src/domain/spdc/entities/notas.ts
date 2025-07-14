import { Entity } from "@/core/entities/Entity";

interface NotasProps {
    ITEN: number;
    E_S: string;
    CHAVE: string;
    MODELO: string;
    SERIE: string;
    MES: string;
    TOTAL_NOTA: number;
    DATA: string;
}

export class Notas extends Entity<NotasProps> {
    get ITEN() {
        return this.props.ITEN;
    }
    get E_S() {
        return this.props.E_S;
    }
    get CHAVE() {
        return this.props.CHAVE;
    }
    get MODELO() {
        return this.props.MODELO;
    }
    get SERIE() {
        return this.props.SERIE;
    }
    get MES() {
        return this.props.MES;
    }
    get TOTAL_NOTA() {
        return this.props.TOTAL_NOTA;
    }
    get DATA() {
        return this.props.DATA;
    }

    static list(cnpj: string, date: Date) {
        
    }

}