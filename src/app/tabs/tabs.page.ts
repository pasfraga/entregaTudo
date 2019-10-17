import { Component } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { EntregaService } from '../services/entrega.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  protected quantUsuario:number = 0;
  protected quantEntrega:number = 0;

  constructor(
    protected usuarioService:UsuarioService,
    protected entregaService:EntregaService

  ) {
    this.usuarioService.getAll().subscribe(
      res=>{
        this.quantUsuario = res.length
    
      }
    );
    this.entregaService.getAll().subscribe(
      res=>{
        this.quantEntrega = res.length
    
      }
    );

  }

}
