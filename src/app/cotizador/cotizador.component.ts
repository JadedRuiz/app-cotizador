import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { routeAnimationState } from '../shared/route-animations';

@Component({
  selector: 'app-cotizador',
  standalone: true,
  imports: [RouterOutlet], // Solo necesitas RouterOutlet si estás utilizando rutas dentro del componente
  templateUrl: './cotizador.component.html',
  styleUrls: ['./cotizador.component.css'],
  animations: [routeAnimationState]
})
export class CotizadorComponent implements AfterViewInit {

  constructor(
    private cdr: ChangeDetectorRef,
    private _router: Router
  ) { }

  ngOnInit(): void {
    // Aquí podrías navegar a una ruta inicial si lo deseas
    this._router.navigate(['fase']);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges(); // Forzamos la detección de cambios
  }

  prepareRoute(outlet: RouterOutlet): string | null {
    if (outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']) {
      return outlet.activatedRouteData['animation']; // Solo si la ruta tiene animación
    }
    return null; // Si no tiene animación, se desactiva la animación
  }
}