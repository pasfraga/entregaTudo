import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EntregaService } from 'src/app/services/entrega.service';

@Component({
  selector: 'app-list-entrega',
  templateUrl: './list-entrega.page.html',
  styleUrls: ['./list-entrega.page.scss'],
})
export class ListEntregaPage implements OnInit {
  protected entregas: any;
  protected router:Router

  ngOnInit() {}
    constructor(
    protected entregaService: EntregaService
  ) {
    this.entregas = this.entregaService.getAll();
  }

  editar(key){
    this.router.navigate(['/tabs/addEntrega',key]);
  }

  async doRefresh(event) {
    console.log('Begin async operation');
    this.entregas = await this.entregaService.getAll();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 500);

  }

}
