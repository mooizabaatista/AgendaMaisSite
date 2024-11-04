import { Injectable } from '@angular/core';

import { baseUrl } from '../utils/shared-links'; import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento } from '../interfaces/agendamento';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  constructor(private httpClient: HttpClient) { }

  getAll(estabelecimentoId: any): Observable<Agendamento[]> {
    return this.httpClient.get<Agendamento[]>(baseUrl + `Agendamentos/GetAll/${estabelecimentoId}`)
  }

  add(agendamento: Agendamento): Observable<Agendamento> {
    return this.httpClient.post<Agendamento>(baseUrl + 'Agendamentos', agendamento)
  }

  update(id: any, agendamento: Agendamento): Observable<Agendamento> {
    return this.httpClient.put<Agendamento>(baseUrl + `Agendamentos/update/${id}`, agendamento)
  }

  delete(id: any): Observable<Agendamento> {
    return this.httpClient.delete<Agendamento>(baseUrl + `Agendamentos/delete/${id}`)
  }
}
