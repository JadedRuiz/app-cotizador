import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import $ from 'jquery';
import { CotizadorService } from '../../core/services/cotizador.service';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
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

  public arrayLotes: any;

  constructor(private _serCotizador: CotizadorService) { }

  ngOnInit() : void {
      this.loadSvg();
  }

  loadSvg() {
    this._serCotizador.arrayLotes$.subscribe(lotes => {
      let nodos = $("#Capa_1").find("text");
      nodos.each((index : number, value : any) => {
        let poligono = $(value).prev();
        let objLote =lotes.find((x : any) => $(value).html().includes(x.sTipoLote));

        if(objLote) {
          switch(objLote.iStatus) {
            //Disponible
            case 1:
              $(value).addClass('disponible');
              $(poligono).addClass('p-disponible');
              $(poligono).addClass('lote-'+objLote.iLote);
              // let html = poligono[0].outerHTML;
              // html= html.replace('><',' [ngbPopover]="popContent" triggers="mouseenter:mouseleave" container="body"><');
              // poligono[0].outerHTML= html;
              // $(poligono).html(html);
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
    });
  }
}
// [ngbPopover]="popContent" triggers="mouseenter:mouseleave" container="body"