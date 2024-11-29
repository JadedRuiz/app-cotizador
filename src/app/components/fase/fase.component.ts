import { Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { CotizadorService } from '../../core/services/cotizador.service';
import { firstValueFrom } from 'rxjs';
import { LoteService } from '../../core/services/lote.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EtapaService } from '../../core/services/etapa.service';
import { ModalCotizadorComponent } from "../modal-cotizador/modal-cotizador.component";

@Component({
  selector: 'app-fase',
  standalone: true,
  imports: [ModalCotizadorComponent],
  templateUrl: './fase.component.html',
  styleUrl: './fase.component.css'
})
export class FaseComponent {

  arrayEtapas: any;
  arrayLotesEtapa: any;
  @Input() scr: string = './assets/Imagenes/Empresas/Ziba/svgs/fachada/FachadaSVG.svg';
  
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
          this.pintarNivel(element);
          $('#'+element.iEtapa).addClass('nivel');
          $('#'+element.iEtapa).children().each((index : number, element_hijo : any) => {
            $(element_hijo).addClass('hijo');
          });
        });
      });
  }

  pintarNivel(nivel : any) {
    let html=`<div class="nivel${nivel.iEtapa}">${nivel.sEtapa}</div>`;
    $(".niveles").prepend(html);
  }

  abrirNivel(event: Event) {
    let iEtapa = this.recuperarNivel(event)
    if(iEtapa != null) {
      let etapa = this.arrayEtapas.find((x : any) => x.iEtapa == iEtapa);
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
      }
      
    }
  }

  recuperarNivel(event : any) {
    if(event && event.target.parentElement && event.target.parentElement.nodeName == "g" && event.target.parentElement.id != "Fachada") {
      return event.target.parentElement.id;
    }
    return null;
  }
}
