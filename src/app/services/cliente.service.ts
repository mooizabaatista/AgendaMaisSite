import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cliente } from '../interfaces/cliente';
import { baseUrl } from '../utils/shared-links';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private httpClient: HttpClient) { }

  getAll(estabelecimentoId: any): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(baseUrl + `Clientes/${estabelecimentoId}`)
  }

  add(Cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(baseUrl + 'Clientes', Cliente)
  }

  update(id: any, Cliente: Cliente): Observable<Cliente> {
    return this.httpClient.put<Cliente>(baseUrl + `Clientes/update/${id}`, Cliente)
  }

  delete(id: any): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(baseUrl + `Clientes/delete/${id}`)
  }
}
