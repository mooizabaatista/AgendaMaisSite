import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Agendamento } from 'src/app/interfaces/agendamento';
import { Cliente } from 'src/app/interfaces/cliente';
import { Servico } from 'src/app/interfaces/servico';
import { AgendamentoService } from 'src/app/services/agendamento.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { MensagemServiceService } from 'src/app/services/mensagem-service.service';
import { ServicoService } from 'src/app/services/servico.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.css']
})
export class AgendamentoComponent {

  frmAgendamento!: FormGroup
  agendamentos: Agendamento[] = [];
  servicos: Servico[] = [];
  clientes: Cliente[] = [];
  clienteSelecionado!: number;
  estId!: number;
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 8;
  valorTotal: number = 0;

  public data: any[] = [];
  public settings: any = [];
  public selectedItems: any = [];


  constructor(
    private modalService: NgbModal,
    private agendamentoService: AgendamentoService,
    private servicoService: ServicoService,
    private clienteService: ClienteService,
    private mensagemService: MensagemServiceService,
    private config: NgSelectConfig) {
  }


  ngOnInit(): void {
    this.listarAgendamentos();

    this.inicializarFormulario();

    this.listarServicos();

    this.listarClientes();

    this.config.notFoundText = 'Cliente não localizado';
    this.config.bindValue = 'value';

    this.settings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Selecionar todos',
      unSelectAllText: 'Desmarcar todos',
      allowSearchFilter: true,
      searchPlaceholderText: 'Pesquisar',
      noDataAvailablePlaceholderText: 'Nenhum serviço disponível',
      enableCheckAll: false,
      primaryKey: 'item_id',
      labelKey: 'item_text',
    };
  }

  listarAgendamentos() {
    const estId = localStorage.getItem('estId')

    if (estId) {
      this.agendamentoService.getAll(estId)
        .subscribe({
          next: (data: any) => {
            this.agendamentos = data.resultado;
          }
        })
    }
  }

  listarServicos() {
    const estId = localStorage.getItem('estId');

    if (estId) {
      this.servicoService.getAll(estId).subscribe({
        next: (data: any) => {
          this.data = data.resultado.map((servico: any) => ({
            item_id: servico.id,
            item_text: servico.nome,
            item_valor: servico.preco
          }));
        },
        error: (error: any) => {
          console.error("Erro ao buscar serviços:", error);
        }
      });
    }
  }

  listarClientes() {
    const estId = localStorage.getItem('estId');

    if (estId) {
      this.clienteService.getAll(estId).subscribe({
        next: (data: any) => {
          this.clientes = data.resultado
        },
        error: (error: any) => {
          console.error("Erro ao buscar os clientes:", error);
        }
      });
    }
  }

  onItemSelect(item: any) {
    const servicoSelecionado = this.data.find(servico => servico.item_id === item.item_id);
    this.valorTotal += servicoSelecionado.item_valor;
  }

  onDeselect(item: any) {
    const servicoSelecionado = this.data.find(servico => servico.item_id === item.item_id);
    this.valorTotal -= servicoSelecionado.item_valor;
  }

  abrirModal(content: any, item?: Agendamento) {

    if (item) {
      this.inicializarFormulario(item)
    } else {
      this.inicializarFormulario()
    }

    this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false
    });
  }

  fecharModal() {
    this.valorTotal = 0;
    this.frmAgendamento.patchValue({
      id: null,
      data: '',
      horaInicio: '',
      horaFim: '',
      concluido: false,
      cancelado: false,
      valorTotal: 0,
      clienteId: null, // O ID do cliente é passado corretamente
      servicos: []
    });
    this.modalService.dismissAll();
  }




  inicializarFormulario(item?: Agendamento) {
    const estId = localStorage.getItem('estId');
    const formattedDate = item?.data.split('T')[0];

    if (!this.frmAgendamento) {
      this.frmAgendamento = new FormGroup({
        id: new FormControl(),
        data: new FormControl('', Validators.required),
        horaInicio: new FormControl('', Validators.required),
        horaFim: new FormControl('', Validators.required),
        clienteId: new FormControl('', Validators.required),
        concluido: new FormControl(false),
        cancelado: new FormControl(false),
        valorTotal: new FormControl(0, Validators.required),
        servicos: new FormControl([], Validators.required),
        estabelecimentoId: new FormControl(estId)
      });
    }

    // Edição
    if (item) {
      this.clienteSelecionado = item.clienteId; // Corrigido para pegar o ID do cliente

      this.valorTotal = item.valorTotal ?? 0;

      const servicosArray = Array.isArray(item.servicos) ? item.servicos.map((servico: any) => ({
        item_id: servico.id,
        item_text: servico.nome
      })) : [];

      this.frmAgendamento.patchValue({
        id: item.id,
        data: formattedDate,
        horaInicio: item.horaInicio,
        horaFim: item.horaFim,
        concluido: item.concluido,
        cancelado: item.cancelado,
        valorTotal: item.valorTotal,
        clienteId: item.clienteId, // O ID do cliente é passado corretamente
        servicos: servicosArray
      });
    }
  }


  formatarHora(hora: string): string {
    // Verifica se a hora está no formato HH:MM e adiciona :00 se necessário
    if (hora.length === 5) { // HH:MM tem 5 caracteres
      return hora + ':00';
    }
    return hora; // Retorna a hora original se já tiver segundos
  }

  submitForm() {
    const agendamentoData = this.frmAgendamento.value;
    console.log(agendamentoData)

    // Formatar a data e hora
    const formattedData = agendamentoData.data ? new Date(agendamentoData.data).toISOString() : ""; // Usando string vazia

    const horaInicio = this.formatarHora(agendamentoData.horaInicio);
    const horaFim = this.formatarHora(agendamentoData.horaFim);

    let agendamento: Agendamento = {
      id: agendamentoData.id,
      data: formattedData,
      horaInicio: horaInicio,
      horaFim: horaFim,
      concluido: agendamentoData.concluido,
      cancelado: agendamentoData.cancelado,
      clienteId: agendamentoData.clienteId,
      valorTotal: agendamentoData.valorTotal ?? 0,
      servicos: agendamentoData.servicos.map((item: any) => item.item_id) // IDs dos serviços
    };

    const requestBody = {
      agendamentoDto: agendamento
    };

    if (!agendamentoData.id) {
      this.agendamentoService.add(agendamento).subscribe({
        next: (data: any) => {
          this.mensagemService.mostrarMensagemSucesso("Agendamento cadastrado com sucesso!");
          this.fecharModal();
          this.ngOnInit();
        },
        error: (error: any) => {
          this.mensagemService.mostrarMensagemErro(error);
        }
      });
    } else {
      this.agendamentoService.update(agendamento.id, agendamento).subscribe({
        next: (data: any) => {
          if (data.estaValido) {
            this.mensagemService.mostrarMensagemSucesso("Agendamento atualizado com sucesso!")
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
        <p>Todos os itens relacionados a este agendamento serão excluidos, tais como: </p>
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
        this.agendamentoService.delete(id).subscribe({
          next: (data) => {
            this.mensagemService.mostrarMensagemSucesso("Agendamento excluido com sucesso!")
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

  get filteredAgendamentos() {
    return this.agendamentos
      .filter(agendamento => {
        return agendamento.cliente?.nome.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          agendamento.cliente?.email.toString().includes(this.searchTerm) ||
          agendamento.cliente?.telefone.toString().includes(this.searchTerm);
      })
      .slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
  }

  onPageChange(page: number) {
    this.page = page;
  }
}
