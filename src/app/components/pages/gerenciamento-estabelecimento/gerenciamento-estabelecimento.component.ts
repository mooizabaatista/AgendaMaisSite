import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Estabelecimento } from 'src/app/interfaces/estabelecimento';
import { EstabelecimentoService } from 'src/app/services/estabelecimento.service';
import { MensagemServiceService } from 'src/app/services/mensagem-service.service';
import { ValidacaoEstabelecimentoService } from 'src/app/services/validacao-estabelecimento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gerenciamento-estabelecimento',
  templateUrl: './gerenciamento-estabelecimento.component.html',
  styleUrls: ['./gerenciamento-estabelecimento.component.css']
})
export class GerenciamentoEstabelecimentoComponent implements OnInit {

  frmEstabelecimento!: FormGroup
  estabelecimentos: Estabelecimento[] = [];

  constructor(
    private estabelecimentoService: EstabelecimentoService,
    private validacaoEstabelecimentoService: ValidacaoEstabelecimentoService,
    private modalService: NgbModal,
    private mensagemService: MensagemServiceService) { }

  ngOnInit(): void {
    this.listarEstabelecimentos();
    this.inicializarFormulario();
  }

  listarEstabelecimentos() {
    this.estabelecimentoService.getAll()
      .subscribe({
        next: (data: any) => {
          this.estabelecimentos = data.resultado;
        }
      })
  }

  inicializarFormulario(item?: Estabelecimento) {
    // Edição
    if (item !== null && item !== undefined) {
      console.log("Edição")
      this.frmEstabelecimento.patchValue({
        id: item?.id,
        nome: item?.nome,
        endereco: item?.endereco,
        telefone: item?.telefone,
        email: item?.email
      })
    }
    else {
      this.frmEstabelecimento = new FormGroup({
        id: new FormControl(),
        nome: new FormControl('', Validators.required),
        endereco: new FormControl('', Validators.required),
        telefone: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
      })
    }
  }

  submitForm() {
    if (!this.frmEstabelecimento.get('id')?.value) {
      this.estabelecimentoService.add(this.frmEstabelecimento.value).subscribe({
        next: (data: any) => {
          this.fecharModal();
          this.mensagemService.mostrarMensagemSucesso("Local de trabalho cadastrado com sucesso!")
          this.ngOnInit();
        },
        error: (error: any) => {
          this.mensagemService.mostrarMensagemErro(error)
        }
      })
    } else {
      this.estabelecimentoService.update(this.frmEstabelecimento.get('id')?.value, this.frmEstabelecimento.value).subscribe({
        next: (data: any) => {
          this.fecharModal();
          this.mensagemService.mostrarMensagemSucesso("Local de trabalho atualizado com sucesso!")
          this.ngOnInit();
        },
        error: (error: any) => {
          this.mensagemService.mostrarMensagemErro(error)
        }
      })
    }
  }

  confirmacaoExclusao(id: number) {
    Swal.fire({
      title: "Tem certeza?",
      icon: 'question',
      html: `
        <h5 class='p-1' style='background-color: var(--laranja-principal); color: var(--texto-principal-claro)'>Esta opção não pode ser revertida</h5>
        <p>Todos os itens relacionados a este local serão excluidos, tais como: </p>
        <ul class='list-group'>
          <li class='list-group-item'><strong>Serviços</strong></li>
          <li class='list-group-item'><strong>Agendamentos</strong></li>
        </ul>
      `,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'var(--laranja-principal)',
      cancelButtonColor: 'var(--cinza-claro)',
      customClass: {
        confirmButton: 'px-5',
        cancelButton: 'px-5'
      },
      iconColor: 'var(--laranja-secundario)'
    }).then((result) => {
      if (result.isConfirmed) {
        this.estabelecimentoService.delete(id).subscribe({
          next: (data) => {
            this.mensagemService.mostrarMensagemSucesso("Local de trabalho excluido com sucesso!")
            this.ngOnInit();
          },
          error: (error: any) => {
            this.mensagemService.mostrarMensagemErro(error)
          }
        })
      }
    })
  }

  deletar(id: number) {
    this.confirmacaoExclusao(id);
  }

  abrirModal(content: any, item?: Estabelecimento) {

    if (item) {
      this.inicializarFormulario(item)
    } else {
      this.inicializarFormulario()
    }

    this.modalService.open(content);
  }

  fecharModal() {
    this.modalService.dismissAll();
  }

  selecionarEstabelecimento(id: number) {
    return this.validacaoEstabelecimentoService.selecionarEstabelecimento(id);
  }
}
