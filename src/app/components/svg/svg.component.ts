import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import $, { error } from 'jquery';
import { CotizadorService } from '../../core/services/cotizador.service';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Etapa } from '../../core/models/etapa.model';
import { EtapaService } from '../../core/services/etapa.service';
import { LoteService } from '../../core/services/lote.service';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-svg',
  standalone: true,
  imports: [
    NgbPopoverModule
  ],
  templateUrl: './svg.component.html',
  styleUrl: './svg.component.css'
})
export class SvgComponent {

  public arrayEtapas: any;
  public arrayLotes: any;
  public svg: any;
  @Input() scr: string = './assets/Imagenes/Empresas/Ziba/svgs/fachada.svg';  
  @Input() tipo: number = 1; //Etapas

  constructor(
    private _http: HttpClient,
    private _renderer: Renderer2,
    private _eleRef: ElementRef, 
    private _serCotizador: CotizadorService,
    private _etapaService: EtapaService,
    private _loteService: LoteService,
  ) {}

  ngOnInit() : void {
      this.loadSvg();
  }

  loadSvg() {
    this._http.get(this.scr, { responseType: 'text'}).subscribe(
      (svgContent: string) => {
        const container = this._eleRef.nativeElement.querySelector("#svgContainer");
        container.innerHTML = svgContent;
        if(this.tipo == 1) {
          this.loadEtapaSvg();
        }else {
          this.loadLotesSvg();
        }
      },
      (error) => {
        console.log("Error cargando el SVG:", error);
      }
    );
  }

  loadEtapaSvg() {
    this._etapaService.arrayEtapas$.subscribe(etapas => {
      this.arrayEtapas = etapas;
      etapas.forEach((element : any) => {
        $("#"+element.sEtapa).children().removeClass('st0');
        $("#"+element.sEtapa).children().attr("title",element.sEtapa);
        $("#"+element.sEtapa).css({
          'fill': '#96e5f3b3',
          'cursor': 'pointer'
        });
      });
    });
  }

  abrirAccion(event: Event) {
    if(this.tipo == 1) {
      let sEtapa = this.recuperarEtapa(event)
      if(sEtapa != null) {
        let etapa = this.arrayEtapas.find((x : any) => x.sEtapa == sEtapa);
        this.obtenerLotesPorEtapa(etapa);
        return
      }
    }    
  }

  recuperarEtapa(event : any) {
    if(event && (event.target.localName == "rect" || event.target.localName == "polygon") && event.target.nextElementSibling != null) {
      let arrayString= (event.target.nextElementSibling.outerHTML).split('>');  
      let sEtapa = arrayString[1].replaceAll("</text", "");
      sEtapa = sEtapa.replace(" ","_");
      return sEtapa;
    }
    return null;
  }


  async obtenerLotesPorEtapa(etapa: any) : Promise<void> {
    try {
      this.arrayLotes = await firstValueFrom(this._loteService.getLotesPorEtapaId(etapa.iIdEtapa));
    }catch(err) {
      console.log(err);
    }finally {
      if(this.arrayLotes.ok) {
        this.arrayLotes = this.arrayLotes.data;
        this._serCotizador.arrayLotes$.next(this.arrayLotes);
        this.scr = etapa.sPath;
        this.tipo = 2;
        this.loadSvg();
        return;
      }
      
    }
  }

  loadLotesSvg() {
    let nodos = $("#Capa_1").find("text");
    nodos.each((index : number, value : any) => {
      let poligono = $(value).prev();
      let objLote = this.arrayLotes.find((x : any) => $(value).html().includes(x.sTipoLote));

      if(objLote) {
        switch(objLote.iStatus) {
          //Disponible
          case 1:
            $(value).addClass('disponible');
            $(poligono).addClass('p-disponible');
            $(poligono).addClass('lote-'+objLote.iLote);
            break;
          case 2:
            $(value).addClass('no-disponible');
            $(poligono).addClass('p-apartado');
            break;
          case 3:
            $(value).addClass('mo-disponible');
            $(poligono).addClass('p-vendido');
            break;
        }
      }
    });
  }
}
// [ngbPopover]="popContent" triggers="mouseenter:mouseleave" container="body"