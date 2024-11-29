import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CotizadorService } from '../../core/services/cotizador.service';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Cotizacion } from '../../core/models/cotizacion.model';

@Component({
  selector: 'app-modal-cotizador',
  standalone: true,
  imports: [],
  templateUrl: './modal-cotizador.component.html',
  styleUrl: './modal-cotizador.component.css'
})
export class ModalCotizadorComponent {
  
  @ViewChild('cotizadorModal') _modal: any;
  cotizacion= new Cotizacion();
  submitted = false;
  bCotizacion=true;
  form!: FormGroup;
  lote : any;
  iIdFase = 0;
  sPath = "";
  arrayLotes: any;
  precioM2=0;
  precioTotal= 0;
  precioFinanciado= 0;
  precioContraEntrega=0;
  precioEnganche=0;
  precioMensualidad=0;
  iMinEnganche = 0;
  iEnganche=0;
  plazoSeleccionado : any;
  faseSeleccionada: any;

  constructor(
    private _serCotizador: CotizadorService,
    private modalService: NgbModal,
    private _http: HttpClient,
    private _eleRef: ElementRef
  ) { }

  ngOnInit(): void {
    // Inicializa cualquier funcionalidad si es necesario
    this.cargaInicial();
  }

  cargaInicial() {
    this._serCotizador.arrayLotes$.subscribe((lotes) => {
      if(lotes.faseSeleccionada != null) {
        this.openModal();
        this.arrayLotes = lotes.objLotes;
        this.faseSeleccionada = lotes.faseSeleccionada;
        this.iMinEnganche = lotes.faseSeleccionada.iMinEnganche;
        this.loadDeptosSvg(lotes.objLotes);
      }    
    });
  }

  loadDeptosSvg(lotes : any) {
    if(this.faseSeleccionada != undefined) {
      this._http.get(this.faseSeleccionada.sPath, { responseType: 'text'}).subscribe(
        (svgContent: string) => {
        $("#svgContainerDeptos").html(svgContent);
        let nodos = $("#Capa_2").find('text');
        nodos.each((index : number, value : any) => {
          let poligono = $(value).prev();
          let objLote = lotes.find((x : any) => $(value).html().includes(x.sTipoLote));
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
      });
    }
  }

  openModal(){
    this.modalService.open(this._modal, {centered: true, backdrop: false, size: 'xl'});
  }

  // closeModal(): void {
  //   const modalElement = this.el.nativeElement.querySelector('.modal');
  //   modalElement.style.display = 'none'; // Cierra el modal
  // }

}
