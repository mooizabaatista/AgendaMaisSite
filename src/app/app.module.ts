import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { GerenciamentoEstabelecimentoComponent } from './components/pages/gerenciamento-estabelecimento/gerenciamento-estabelecimento.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ClienteComponent } from './components/pages/cliente/cliente.component';
import { ServicoComponent } from './components/pages/servico/servico.component';
import { AgendamentoComponent } from './components/pages/agendamento/agendamento.component';
import { JsonPipe } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GerenciamentoEstabelecimentoComponent,
    NavbarComponent,
    ClienteComponent,
    ServicoComponent,
    AgendamentoComponent
  ],
  imports: [
    JsonPipe,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SweetAlert2Module,
    NgbAlertModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
