import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { ClienteComponent } from './components/pages/cliente/cliente.component';
import { ServicoComponent } from './components/pages/servico/servico.component';
import { AgendamentoComponent } from './components/pages/agendamento/agendamento.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cliente', component: ClienteComponent },
  { path: 'servico', component: ServicoComponent },
  { path: 'agendamento', component: AgendamentoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
