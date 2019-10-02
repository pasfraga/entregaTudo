import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.page.html',
  styleUrls: ['./list-usuario.page.scss'],
})
export class ListUsuarioPage implements OnInit {

  protected usuarios: any;

  ngOnInit() {
  }

  constructor(
    protected usuarioService: UsuarioService
  ) {
    this.usuarios = this.usuarioService.getAll();
  }

  async doRefresh(event) {
    console.log('Begin async operation');
    this.usuarios = await this.usuarioService.getAll();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);

  }
}