import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensagemServiceService {

  constructor() { }

  mostrarMensagemErro(error: any) {
    const errorList = error.map((erro: any) => {
      return `<li class='list-group-item'>${erro}</li>`;
    }).join('');

    Swal.fire({
      title: "Erro!",
      html: `<ul class='list-group'>${errorList}</ul>`,
      icon: 'error'
    });
  }

  mostrarMensagemSucesso(mensagem: string) {
    Swal.fire({
      title: "Sucesso!",
      icon: 'success',
      text: mensagem
    });
  }
}
