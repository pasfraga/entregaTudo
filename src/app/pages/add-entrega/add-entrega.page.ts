import { Component, OnInit } from '@angular/core';
import { Entrega } from 'src/app/model/entrega';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EntregaService } from 'src/app/services/entrega.service';
import { Camera } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-add-entrega',
  templateUrl: './add-entrega.page.html',
  styleUrls: ['./add-entrega.page.scss'],
})
export class AddEntregaPage implements OnInit {

  protected entrega: Entrega = new Entrega;
  protected id: string = null;
  protected preview: string = null

  constructor(
      protected entregaService: EntregaService,
      protected AlertController: AlertController,
      protected router: Router,
      protected activedRoute: ActivatedRoute,
      private camera: Camera,
  
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

    if (!this.preview){
      this.presentAlert("Ops,","Tire sua Foto!!")
    }
    else{
      this.entrega.foto = this.preview;
    

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

  tirarFoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.preview = base64Image;
    }, (err) => {
     // Handle error
    });
  }
  
  }

