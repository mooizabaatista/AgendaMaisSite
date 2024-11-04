import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/interfaces/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { MensagemServiceService } from 'src/app/services/mensagem-service.service';
import { ValidacaoEstabelecimentoService } from 'src/app/services/validacao-estabelecimento.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  frmCliente!: FormGroup
  clientes: Cliente[] = [];
  estId!: number;
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 10;

  constructor(
    private modalService: NgbModal,
    private clienteService: ClienteService,
    private mensagemService: MensagemServiceService) { }


  ngOnInit(): void {
    this.listarClientes();
    this.inicializarFormulario();
  }

  listarClientes() {
    const estId = localStorage.getItem('estId')

    if (estId) {
      this.clienteService.getAll(estId)
        .subscribe({
          next: (data: any) => {
            this.clientes = data.resultado;
          }
        })
    }
  }

  abrirModal(content: any, item?: Cliente) {

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

  inicializarFormulario(item?: Cliente) {

    const estId = localStorage.getItem('estId')

    // Edição
    if (item !== null && item !== undefined) {
      console.log("Edição")
      this.frmCliente.patchValue({
        id: item?.id,
        nome: item?.nome,
        telefone: item?.telefone,
        email: item?.email,
        estabelecimentoId: item?.estabelecimentoId
      })
    }
    else {
      this.frmCliente = new FormGroup({
        id: new FormControl(),
        nome: new FormControl('', Validators.required),
        endereco: new FormControl('', Validators.required),
        telefone: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required),
        estabelecimentoId: new FormControl(estId)
      })
    }
  }

  submitForm() {
    const clienteData = this.frmCliente.value;

    if (!clienteData.id) {
      this.clienteService.add(clienteData).subscribe({
        next: (data: any) => {
          this.fecharModal();
          this.mensagemService.mostrarMensagemSucesso("Cliente cadastrado com sucesso!");
          this.ngOnInit();
        },
        error: (error: any) => {
          this.mensagemService.mostrarMensagemErro(error.error.resultado);
        }
      });
    } else {
      this.clienteService.update(clienteData.id, clienteData).subscribe({
        next: (data: any) => {
          this.fecharModal();
          this.mensagemService.mostrarMensagemErro("Cliente atualizado com sucesso!");
          this.ngOnInit();
        },
        error: (error: any) => {
          this.mensagemService.mostrarMensagemErro(error.error.resultado);
        }
      });
    }
  }

  get filteredClientes() {
    return this.clientes
      .filter(cliente => {
        return cliente.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          cliente.telefone.includes(this.searchTerm);
      })
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  onPageChange(page: number) {
    this.page = page;
  }
}

