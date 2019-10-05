import { Component, OnInit } from '@angular/core';
import { Entrega } from 'src/app/model/entrega';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EntregaService } from 'src/app/services/entrega.service';

@Component({
  selector: 'app-add-entrega',
  templateUrl: './add-entrega.page.html',
  styleUrls: ['./add-entrega.page.scss'],
})
export class AddEntregaPage implements OnInit {

  protected entrega: Entrega = new Entrega;
  protected id: string = null;

  constructor(
      protected entregaService: EntregaService,
      protected AlertController: AlertController,
      protected router: Router,
      protected activedRoute: ActivatedRoute,
  
  ) { }

  ngOnInit() {
    this.id = this.activedRoute.snapshot.paramMap.get('id');
    if (  this.id ){
      this.entregaService.get(this.id).subscribe(
      res => {
        this.entrega = res

      },
      erro => this.id = null
    )
    
  }}

  onsubmit(form) {
    if(this.id){
      this.entregaService.save(this.entrega).then(
        res => {
          console.log("Atualizado!!");
          this.presentAlert("Aviso", "Atualizado");
        },
        erro => {
          console.log("Erro: " + erro);
          this.presentAlert("Erro", "Erro ao Atualizar");
        }
      )

    }else{
    this.entregaService.save(this.entrega).then(
      res => {
        console.log("Cadastrado!!");
        this.presentAlert("Aviso", "Cadastrado");
      },
      erro => {
        console.log("Erro: " + erro);
        this.presentAlert("Erro", "Erro ao cadastrar");
      }
      )
    }
  }
  async presentAlert(titulo: string, texto: string) {
    const alert = await this.AlertController.create({
      header: titulo,
      //subHeader: 'Subtitle',
      message: texto,
      buttons: ['OK']
    });

    await alert.present();
  }
  

}
