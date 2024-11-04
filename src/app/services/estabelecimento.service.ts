import { Injectable } from '@angular/core';

import { baseUrl } from '../utils/shared-links'; import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estabelecimento } from '../interfaces/estabelecimento';
'../utils/shared-links'

@Injectable({
  providedIn: 'root'
})
export class EstabelecimentoService {

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Estabelecimento[]> {
    return this.httpClient.get<Estabelecimento[]>(baseUrl + 'Estabelecimentos')
  }

  add(estabelecimento: Estabelecimento): Observable<Estabelecimento> {
    return this.httpClient.post<Estabelecimento>(baseUrl + 'Estabelecimentos', estabelecimento)
  }

  update(id: any, estabelecimento: Estabelecimento): Observable<Estabelecimento> {
    return this.httpClient.put<Estabelecimento>(baseUrl + `Estabelecimentos/update/${id}`, estabelecimento)
  }

  delete(id: any): Observable<Estabelecimento> {
    return this.httpClient.delete<Estabelecimento>(baseUrl + `Estabelecimentos/delete/${id}`)
  }
}
