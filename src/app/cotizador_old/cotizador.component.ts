import { Component } from '@angular/core';
import { MapaComponent } from '../components/mapa/mapa.component';
import { CotizadorService } from '../core/services/cotizador.service';
import { error } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-cotizador',
  standalone: true,
  imports: [
    MapaComponent
  ],
  templateUrl: './cotizador.component.html',
  styleUrl: './cotizador.component.css'
})
export class CotizadorComponent {

  arrayEtapas: any;
  arrayLotesEtapa: any;

  constructor(private _servCotizador: CotizadorService) { }

  ngOnInit(): void {
    
  }
}
