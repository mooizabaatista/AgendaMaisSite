import { Component } from '@angular/core';
import { ValidacaoEstabelecimentoService } from './services/validacao-estabelecimento.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AgendaMaisSite';

  constructor(private validacaoEstabelecimentoService: ValidacaoEstabelecimentoService,) { }

  validarEstabelecimento(): boolean {
    return this.validacaoEstabelecimentoService.validarEstabelecimento();
  }

  alterarEstabelecimento() {
    const estId = this.validacaoEstabelecimentoService.getEstabelecimentoId();
    this.validacaoEstabelecimentoService.removerEstabelecimento(Number(estId))
    location.reload();
  }
}
