import { Component, ElementRef, HostBinding, Input } from '@angular/core';
import { CotizadorService } from '../../core/services/cotizador.service';
import { firstValueFrom } from 'rxjs';
import { LoteService } from '../../core/services/lote.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EtapaService } from '../../core/services/etapa.service';

@Component({
  selector: 'app-fase',
  standalone: true,
  imports: [],
  templateUrl: './fase.component.html',
  styleUrl: './fase.component.css'
})
export class FaseComponent {

  arrayEtapas: any;
  arrayLotesEtapa: any;
  @Input() scr: string = './assets/Imagenes/Empresas/Ziba/svgs/fachada.svg';
  
  constructor(
    private _serCotizador: CotizadorService,
    private _loteService: LoteService,
    private _router: Router,
    private _http: HttpClient,
    private _eleRef: ElementRef, 
    private _etapaService: EtapaService,
  ) {}

  ngOnInit() : void {
    this.cargaInicial();
  }

  cargaInicial() {
    this._etapaService.obtenerEtapas()
    .subscribe((resp: any) => {
      if(resp.ok){
        this.arrayEtapas = resp.data;
        this.loadSvg(resp.data);
      }
    });
  }
  
  loadSvg(niveles : any) {
    this._http.get(this.scr, { responseType: 'text'}).subscribe(
      (svgContent: string) => {
        const container = this._eleRef.nativeElement.querySelector("#svgContainer");
        container.innerHTML = svgContent;
        niveles.forEach((element : any) => {
          $("#"+element.sEtapa).children().removeClass('st0');
          $("#"+element.sEtapa).children().attr("title",element.sEtapa);
          $("#"+element.sEtapa).css({
            'fill': '#96e5f3b3',
            'cursor': 'pointer'
          });
        });
      });
  }

  abrirNivel(event: Event) {
    let sEtapa = this.recuperarNivel(event)
    if(sEtapa != null) {
      let etapa = this.arrayEtapas.find((x : any) => x.sEtapa == sEtapa);
      this.obtenerDetopsPorNivel(etapa);
    }        
  }

  async obtenerDetopsPorNivel(etapa: any) : Promise<void> {
    let arrayLotes = null;
    try {
      arrayLotes = await firstValueFrom(this._loteService.getLotesPorEtapaId(etapa.iIdEtapa));
    }catch(err) {
      console.log(err);
    }finally {
      if(arrayLotes.ok) {
        let infoNivel = {
          faseSeleccionada : etapa,
          objLotes : arrayLotes.data
        }
        this._serCotizador.arrayLotes$.next(infoNivel);
        this.scr = etapa.sPath;
        this._router.navigate(['subfase']);
      }
      
    }
  }

  recuperarNivel(event : any) {
    if(event && (event.target.localName == "rect" || event.target.localName == "polygon") && event.target.nextElementSibling != null) {
      let arrayString= (event.target.nextElementSibling.outerHTML).split('>');  
      let sEtapa = arrayString[1].replaceAll("</text", "");
      sEtapa = sEtapa.replace(" ","_");
      return sEtapa;
    }
    return null;
  }
}
