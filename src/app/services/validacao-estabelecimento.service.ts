import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidacaoEstabelecimentoService {

  constructor() { }


  selecionarEstabelecimento(id: number): void {
    localStorage.setItem('estId', id.toString())
  }

  removerEstabelecimento(id: number): void {
    const estId = localStorage.getItem('estId');
    if (estId) {
      localStorage.removeItem('estId')
    }
  }

  validarEstabelecimento(): boolean {
    const estId = localStorage.getItem('estId')

    if (estId) {
      return true;
    } else {
      return false;
    }
  }

  getEstabelecimentoId(): string {
    const estId = localStorage.getItem('estId');
    if (estId) {
      return estId;
    } else {
      return ""
    }
  }
}
