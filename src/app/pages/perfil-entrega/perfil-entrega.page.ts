import { Component, OnInit } from '@angular/core';
import { Entrega } from 'src/app/model/entrega';
import { EntregaService } from 'src/app/services/entrega.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-entrega',
  templateUrl: './perfil-entrega.page.html',
  styleUrls: ['./perfil-entrega.page.scss'],
})
export class PerfilEntregaPage implements OnInit {

  protected entrega: Entrega = new Entrega;
  protected id: string = null;

  constructor(
    protected entregaService: EntregaService,
    protected router: Router,
    protected ativedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.ativedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.entregaService.get(this.id).subscribe(
        res => {
          this.entrega = res;
        },
        erro => this.id = null
      )
    }
  }
}
