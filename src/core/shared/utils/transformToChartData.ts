import { Count } from "@/domain/spdc/dto/notas";

export interface ChartData {
    day: string;
    nfe: number;
    nfce: number;
    cte: number
}

export function transformToChartData(data: Count[]) {
    // Transformando o groupByDay, em um par de chave-valor
    const groupedByDay: Record<string, ChartData> = {};

    data.forEach((item) => {
        const rawDay = item.DIA_MES.replace(/\s+/g, ''); // Remover os epaços
        const [day, month] = rawDay.split('-'); // Separar em 2 arrays pelo hífen
        const formattedDay = `${day.padStart(2, '0')}-${month.toLowerCase().substring(0, 3)}`; // padStart -> Vai preencher string vazia com 0 a esquerda

        if (!groupedByDay[formattedDay]) {
            groupedByDay[formattedDay] = {
                day: formattedDay,
                nfe: 0,
                nfce: 0,
                cte: 0
            }
        }

        switch (item.MODELO) {
            case 55:
                groupedByDay[formattedDay].nfe += item.TOTAL;
                break;
            case 65:
                groupedByDay[formattedDay].nfce += item.TOTAL;
                break;
            case 57:
                groupedByDay[formattedDay].cte += item.TOTAL;
                break;
        }
    });

    return Object.values(groupedByDay).sort((a, b) => {
        const dateA = new Date(`2025-${a.day.split('-')[1]}-${a.day.split('-')[0]}`);
        const dateB = new Date(`2025-${b.day.split('-')[1]}-${b.day.split('-')[0]}`);
        return dateA.getTime() - dateB.getTime();
    })
}