import { Component, ElementRef, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Output() alterEstabelecimento = new EventEmitter();

  constructor(private offcanvasService: NgbOffcanvas) { }

  abrirMenu(content: TemplateRef<any>) {
    this.offcanvasService.open(content, {
      panelClass: 'custom-offcanvas'
    });
  }

  fecharMenu() {
    this.offcanvasService.dismiss();
  }

  onAlterarEstabelecimento() {
    this.alterEstabelecimento.emit(true);
  }

}
