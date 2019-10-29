import { Component, OnInit } from '@angular/core';
import { Entrega } from 'src/app/model/entrega';
import { EntregaService } from 'src/app/services/entrega.service';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';

@Component({
  selector: 'app-add-entrega',
  templateUrl: './add-entrega.page.html',
  styleUrls: ['./add-entrega.page.scss'],
})
export class AddEntregaPage implements OnInit {

  protected entrega: Entrega = new Entrega;
  protected id: string = null;
  protected preview: string[] = null;
  protected map: GoogleMap;

  slideOpts = {
    initialSlide: 1,
    slidesPerView: 3,
    speed: 400
  };

  constructor(
    protected entregaService: EntregaService,
    protected alertController: AlertController,
    protected router: Router,
    protected activedRoute: ActivatedRoute,
    private geolocation: Geolocation,
    private camera: Camera
  ) { }

  ngOnInit() {
    this.localAtual()
  }
  ionViewDidLoad() {
  }

  //função chamada toda vez que a pagina recebe foco;
  ionViewWillEnter() {
    this.id = this.activedRoute.snapshot.paramMap.get("id");
    if (this.id) {
      this.entregaService.get(this.id).subscribe(
        res => {
          this.entrega = res
        },
        erro => this.id = null
      )
    }
  }

  onsubmit(form) {
    if (!this.preview) {
      this.presentAlert("Ops!", "Tire sua foto!")
    } else {
      this.entrega.foto = this.preview;
      if (this.id) {
        this.entregaService.update(this.entrega, this.id).then(
          res => {
            this.presentAlert("Aviso", "Atualizado!");
            form.reset();
            this.entrega = new Entrega;
            this.router.navigate(['/tabs/listEntrega']);
          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("Erro", "Erro ao atualizar!");
          }
        )
      } else {
        this.entregaService.save(this.entrega).then(
          res => {
            this.presentAlert("Aviso", "Cadastrado!");
            form.reset();
            this.entrega = new Entrega;
            this.router.navigate(['/tabs/listEntrega']);
          },
          erro => {
            console.log("Erro: " + erro);
            this.presentAlert("Erro", "Erro ao cadastrar!");
          }
        )
      }
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

  localAtual() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.entrega.lat = resp.coords.latitude
      this.entrega.lng = resp.coords.longitude
      this.loadMap()
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  tirarFoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      if (!this.preview) this.preview = [];
      this.preview.push(base64Image);
    }, (err) => {
      // Handle error
    });
  }

  async removerFoto(index) {
    const alert = await this.alertController.create({
      header: 'Confirmar Remoção!',
      message: 'Deseja remover a foto?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sim',
          handler: () => {
            //console.log('Confirm Okay');
            this.preview.splice(index, 1)
          }
        }
      ]
    });
    await alert.present();
  }
  loadMap() {
    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: this.entrega.lat,
           lng: this.entrega.lng
         },
         zoom: 18,
         tilt: 30
       }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    let marker: Marker = this.map.addMarkerSync({
      title: 'Ionic',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: this.entrega.lat,
        lng: this.entrega.lng
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });
    this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe(
      res=>{
        console.log(res);
        marker.setPosition(res[0]);
        this.entrega.lat = res[0].lat;
        this.entrega.lng = res[0].lng;
      }
    )
  }
}