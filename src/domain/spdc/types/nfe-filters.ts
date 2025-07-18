interface Nfe {
    ITEN: number,
    NOTA: number,
    SERIE: string,
    CHAVE: string,
    AUTORIZACAO: string,
    EMISSAO_SEFAZ: string,
    MODELO: number,
    TOTAL_NOTA: number,
    E_S: string,
    MES?: number,
    STATUS: string,
    DATA: string
}


export interface TotalsByPeriodParams {
    cnpj: string;
    e_s?: string;
    type: string;
    initialDate: string;
    finalDate: string;
    serieNf?: string;
}

export interface TotalByPeriodResponse {
    NOTA: number;
    STATUS: string;
    TOTAL_NOTA: number;
}

export interface CountResponse {
    COUNT: number;
}

export interface CalculatedTotals {
    countAut: number;
    countCanc: number;
    totalAut: number;
    totalCanc: number;
    pageCount: number;
}

export interface NfeResponse {
    data: Nfe[],
    count: CountResponse[];
    totals: TotalByPeriodResponse[]
    calculatedTotals: CalculatedTotals
}

export interface NfeSearchParams {
    cnpj: string;
    type: string;
    initialDate: Date;
    finalDate: Date;
    page: number;
    numberNf?: string;
    serieNf?: string;
    e_s?: string;
    razaoNf?: string;
}
