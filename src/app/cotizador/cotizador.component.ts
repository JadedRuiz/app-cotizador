import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { routeAnimationState } from '../shared/route-animations';
import { EtapaService } from '../core/services/etapa.service';
import { LoteService } from '../core/services/lote.service';
import { CotizadorService } from '../core/services/cotizador.service';

@Component({
  selector: 'app-cotizador',
  standalone: true,
  imports: [RouterOutlet], // Solo necesitas RouterOutlet si estás utilizando rutas dentro del componente
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.css'],
  animations: [routeAnimationState]
})
export class CotizadorComponent {

  arrayNiveles: any;
  nivelSeleccionado: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private _router: Router,
    private _serCotizador: CotizadorService,
    private _etapaService: EtapaService,
    private _loteService: LoteService
  ) { }

  ngOnInit(): void {
    // Aquí podrías navegar a una ruta inicial si lo deseas
    this._router.navigate(["fase"]);
  }
}