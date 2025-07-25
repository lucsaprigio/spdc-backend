export interface Notas {
    ITEN: number;
    E_S: string;
    CHAVE: string;
    MODELO: string;
    SERIE: string;
    MES: string;
    TOTAL_NOTA: number;
    DATA: string;
    RAZAO_SOCIAL?: string;
}

export interface Count {
    TOTAL: number;
    MODELO: number;
    DIA_MES: string
}
