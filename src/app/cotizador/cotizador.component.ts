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
export class CotizadorComponent implements AfterViewInit {

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
    // this.cargaInicial();
    this._router.navigate(["fase"]);
  }

  ngAfterViewInit() {
    // this.cdr.detectChanges(); // Forzamos la detección de cambios
  }

  // cargaInicial() {
  //   this._etapaService.obtenerEtapas()
  //   .subscribe((resp: any) => {
  //     if(resp.ok){
  //       this.arrayNiveles = resp.data;
  //       // this.nivelSeleccionado = resp.data[0];
  //       this.obtenerDetopsPorNivel(resp.data[0]);
  //     }
  //   });
  // }

  // abrirNivel(etapa : any, $index: number) {
  //   $(".nav-link").each((index, element) => {
  //     if(index == $index) {
  //       $(element).addClass('active');
  //     }else{
  //       $(element).removeClass('active');
  //     }
  //   });
  //   this.obtenerDetopsPorNivel(etapa);
  // }

  // async obtenerDetopsPorNivel(etapa: any) : Promise<void> {
  //   let arrayLotes = null;
  //   try {
  //     arrayLotes = await firstValueFrom(this._loteService.getLotesPorEtapaId(etapa.iIdEtapa));
  //   }catch(err) {
  //     console.log(err);
  //   }finally {
  //     if(arrayLotes.ok) {
  //       let infoNivel = {
  //         faseSeleccionada : etapa,
  //         objLotes : arrayLotes.data
  //       }
  //       this._serCotizador.arrayLotes$.next(infoNivel);
  //       this._router.navigate(['subfase']);
  //     }
      
  //   }
  // }

  // prepareRoute(outlet: RouterOutlet): string | null {
  //   if (outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation']) {
  //     return outlet.activatedRouteData['animation']; // Solo si la ruta tiene animación
  //   }
  //   return null; // Si no tiene animación, se desactiva la animación
  // }
}