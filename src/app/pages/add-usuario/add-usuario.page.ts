import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.page.html',
  styleUrls: ['./add-usuario.page.scss'],
})
export class AddUsuarioPage implements OnInit {

  protected usuario: Usuario = new Usuario;
  protected id: string = null;
  protected preview: string = null;

  constructor(
    protected usuarioService: UsuarioService,
    protected alertController: AlertController,
    protected router: Router,
    protected activedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private camera: Camera

  ) { }

  ngOnInit() {
    this.localAtual()
    this.id = this.activedRoute.snapshot.paramMap.get('id');
    if (  this.id ){
      this.usuarioService.get(this.id).subscribe(
      res => {
        this.usuario = res

      },
      erro => this.id = null
    )
    
  }}

  onsubmit(form) {
    if(this.id){
      this.usuarioService.save(this.usuario).then(
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
    this.usuarioService.save(this.usuario).then(
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
    const alert = await this.alertController.create({
      header: titulo,
      //subHeader: 'Subtitle',
      message: texto,
      buttons: ['OK']
    });

    await alert.present();
  }

  localAtual(){
    this.geolocation.getCurrentPosition().then((resp) => {
      // resp.coords.latitude
      this.usuario.lat = resp.coords.latitude
      // resp.coords.longitude
      this.usuario.lng = resp.coords.longitude
     }).catch((error) => {
       console.log('Error getting location', error);
     });
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

