import { Component } from '@angular/core';
import { MapaComponent } from '../components/mapa/mapa.component';

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

}
