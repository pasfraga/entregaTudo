import { Component } from '@angular/core';
import { EntregaService } from '../services/entrega.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  protected entrega:any;

  constructor(
    protected entregaService:EntregaService
  ) { }
 
  ngOnInit() {
    this.entrega = this.entregaService.getAll();
  }
}