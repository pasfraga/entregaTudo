import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database'
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    protected fire: AngularFireDatabase
  ) { }

  save(usuario) {
    return this.fire.list("usuarios").push(usuario);
  }

  getAll() {
    return this.fire.list("usuarios").snapshotChanges()
      .pipe(
        map(
          dados =>
            dados.map(d => ({ key: d.payload.key, ...d.payload.val() }))
        )
      );
  }
}