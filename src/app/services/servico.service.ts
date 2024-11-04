import { Injectable } from '@angular/core';

import { baseUrl } from '../utils/shared-links'; import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servico } from '../interfaces/servico';


@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  constructor(private httpClient: HttpClient) { }

  getAll(estabelecimentoId: any): Observable<Servico[]> {
    return this.httpClient.get<Servico[]>(baseUrl + `Servicos/GetAll/${estabelecimentoId}`)
  }

  add(servico: Servico): Observable<Servico> {
    return this.httpClient.post<Servico>(baseUrl + 'Servicos', servico)
  }

  update(id: any, servico: Servico): Observable<Servico> {
    return this.httpClient.put<Servico>(baseUrl + `Servicos/update/${id}`, servico)
  }

  delete(id: any): Observable<Servico> {
    return this.httpClient.delete<Servico>(baseUrl + `Servicos/delete/${id}`)
  }
}
  