import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensagemServiceService {

  constructor() { }

  mostrarMensagemErro(error: any) {
    console.log(error)
  }

  mostrarMensagemSucesso(mensagem: string) {
    Swal.fire({
      title: "Sucesso!",
      icon: 'success',
      text: mensagem
    });
  }
}
