import { Cliente } from "./cliente"
import { Servico } from "./servico"

export interface Agendamento {
    id: number
    data: string,
    horaInicio: string,
    horaFim: string,
    concluido: boolean,
    cancelado: boolean,
    valorTotal?: number,
    clienteId: number,
    servicos: Servico[],
    cliente?: Cliente,
}
