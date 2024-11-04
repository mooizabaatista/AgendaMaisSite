import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Servico } from 'src/app/interfaces/servico';
import { ServicoService } from 'src/app/services/servico.service';
import { MensagemServiceService } from 'src/app/services/mensagem-service.service';
import { ValidacaoEstabelecimentoService } from 'src/app/services/validacao-estabelecimento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.css']
})
export class ServicoComponent implements OnInit {

  frmServico!: FormGroup
  servicos: Servico[] = [];
  estId!: number;
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 8;

  constructor(
    private modalService: NgbModal,
    private servicoService: ServicoService,
    private mensagemService: MensagemServiceService) { }


  ngOnInit(): void {
    this.listarServicos();
    this.inicializarFormulario();
  }

  listarServicos() {
    const estId = localStorage.getItem('estId')

    if (estId) {
      this.servicoService.getAll(estId)
        .subscribe({
          next: (data: any) => {
            this.servicos = data.resultado;
          }
        })
    }
  }

  abrirModal(content: any, item?: Servico) {

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

  inicializarFormulario(item?: Servico) {

    const estId = localStorage.getItem('estId')

    // Edição
    if (item !== null && item !== undefined) {
      console.log("Edição")
      this.frmServico.patchValue({
        id: item?.id,
        nome: item?.nome,
        preco: item?.preco,
        estabelecimentoId: item?.estabelecimentoId
      })
    }
    else {
      this.frmServico = new FormGroup({
        id: new FormControl(),
        nome: new FormControl('', Validators.required),
        preco: new FormControl(Validators.required),
        estabelecimentoId: new FormControl(estId)
      })
    }
  }

  submitForm() {
    const servicoData = this.frmServico.value;

    if (!servicoData.id) {
      this.servicoService.add(servicoData).subscribe({
        next: (data: any) => {
          this.mensagemService.mostrarMensagemSucesso("Servico cadastrado com sucesso!");
          this.fecharModal();
          this.ngOnInit();
        },
        error: (error: any) => {
          this.mensagemService.mostrarMensagemErro(error);
        }
      });
    } else {
      this.servicoService.update(servicoData.id, servicoData).subscribe({
        next: (data: any) => {
          if (data.estaValido) {
            this.mensagemService.mostrarMensagemSucesso("Servico atualizado com sucesso!")
            this.fecharModal();
            this.ngOnInit();
          }
        },
        error: (error: any) => {
          this.mensagemService.mostrarMensagemErro(error);
        }
      });
    }
  }

  confirmacaoExclusao(id: number) {
    Swal.fire({
      title: "Tem certeza?",
      icon: 'question',
      html: `
        <h5 class='p-1' style='background-color: var(--laranja-principal); color: var(--texto-principal-claro)'>Esta opção não pode ser revertida</h5>
        <p>Todos os itens relacionados a este servico serão excluidos, tais como: </p>
        <ul class='list-group'>
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
        this.servicoService.delete(id).subscribe({
          next: (data) => {
            this.mensagemService.mostrarMensagemSucesso("Servico excluido com sucesso!")
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

  get filteredServicos() {
    return this.servicos
      .filter(servico => {
        return servico.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          servico.preco.toString().includes(this.searchTerm);
      })
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  onPageChange(page: number) {
    this.page = page;
  }
}

