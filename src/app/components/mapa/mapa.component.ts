import { Component, ViewChild } from '@angular/core';
import { SvgComponent } from '../svg/svg.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Cotizacion } from '../../core/models/cotizacion.model';
import { CurrencyPipe } from '@angular/common';
import { Lote } from '../../core/models/lote.model';
import { CotizadorService } from '../../core/services/cotizador.service';
import Swal from 'sweetalert2';
import $ from 'jquery';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SvgComponent,
    NgClass,
    NgIf,
    CurrencyPipe,
    CommonModule
  ],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent {

  cotizacion= new Cotizacion();
  lote : any;
  submitted = false;
  bCotizacion=false;
  form!: FormGroup;
  @ViewChild('cotizadorModal') _modal: any;
  precioM2=0;
  precioTotal= 0;
  precioTotalCotizado= 0;
  precioEnganche=0;
  precioMensualidad=0;
  arrayEtapas: any;
  arrayLotes: any;
  iMinEnganche = 0;
  plazoSeleccionado : any;
  etapaSeleccionada: any = {
    "iEtapa": 0
  };
  buttonEnv= {
    texto: 'Enviar',
    load: false,
    disabled: false
  };

  constructor(
    private modalService: NgbModal, 
    private _formBuilder: FormBuilder,
    private _servCotizador: CotizadorService
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      sNombre: ['', [Validators.required]],
      sCorreo: ['', [Validators.required, Validators.email]],
      iTelefono: ['',[Validators.required, Validators.pattern("^[0-9]*$")]],
      sCiudad: ['', [Validators.required]]
    });
    this.cargaInicial();
  }

   cargaInicial() {
    this._servCotizador.obtenerEtapas()
    .subscribe((resp: any) => {
      if(resp.ok){
        this.arrayEtapas = resp.data;
        this.etapaSeleccionada = resp.data[0];
        this.iMinEnganche = resp.data[0].iMinEnganche;
        this.obtenerLotesPorEtapa(resp.data[0].iIdEtapa);
      }
    });
  }

  obtenerLotesPorEtapa(iIdEtapa: number){
    this._servCotizador.obtenerLotesPorEtapa(iIdEtapa)
    .subscribe((resp : any) => {
      if(resp.ok) {
        this.arrayLotes = resp.data;
        this._servCotizador.arrayLotes$.next(this.arrayLotes);
      }
    })
  }

  obtenerPlazosPorEtapa(iIdEtapa : number) {
    this._servCotizador.obtenerPlazosPorEtapa(iIdEtapa)
    .subscribe((resp : any) => {
      if(resp.ok) {
        this.lote.objPlazos = resp.data;
      }
    })
  }
  
  registrarCotizacion() {
    this.submitted = true;
    // Validar formulario
    if (this.form.invalid) {
      return;
    }
    this.buttonEnv= {
      load: true,
      disabled: true,
      texto: "Enviando..."
    };
    this.cotizacion = this.form.value;
    this.cotizacion.iIdLote = parseInt(this.lote.iIdLote+"");
    this.cotizacion.iIdPlazo=0;
    this.cotizacion.iEnganche=100;
    if(this.plazoSeleccionado != undefined) {
      this.cotizacion.iIdPlazo= this.plazoSeleccionado.iIdPlazo;
      this.cotizacion.iEnganche= this.iMinEnganche;
    }
    this._servCotizador.guardarCotizacion(this.cotizacion)
    .subscribe((resp: any) => {
      if(resp.ok) {
        Swal.fire({
          icon: "success",
          title: resp.data,
          showConfirmButton: false,
          timer: 3500
        });
        this.form.reset();
        this.submitted=false;
        this.buttonEnv= {
          texto: 'Enviar',
          load: false,
          disabled: false
        };
      }else {
        this.buttonEnv= {
          texto: 'Enviar',
          load: false,
          disabled: false
        };
        Swal.fire({
          icon: "error",
          title: resp.data,
          showConfirmButton: false,
          timer: 3500
        });
      }      
    });
  }

  seleccionarPlazo(iIdPlazo : any) {
      if(iIdPlazo != "-1") {
        this.plazoSeleccionado = this.lote.objPlazos.find((x : any) => x.iIdPlazo == iIdPlazo);
        this.calcularCotizacion(this.plazoSeleccionado);
        this.calcularMensualidad();
        this.bCotizacion=true;
        return;
      }
      this.precioM2 = this.lote.iPrecioM2Contado;
      this.precioTotal = this.lote.iSuperficie * this.lote.iPrecioM2Contado;
      this.precioTotalCotizado = this.lote.iSuperficie * this.lote.iPrecioM2Contado;
      this.bCotizacion=false;
  }

  mostrarDetalle(event : any) {
    let lote= this.recuperarLote(event);
    if(lote != null && parseInt(lote)){
      this.lote = this.arrayLotes.find((x: any) => x.iLote == lote);
      if(this.lote.iStatus == 1){
        $(".details").css({
          'top': $(".lote-"+this.lote.iLote).position().top-80,
          'left': $(".lote-"+this.lote.iLote).position().left
        });
        $(".details").show();
      }else{
        $(".details").hide();
      }
    }
  }

  esconderDetalle(event : any){
    let lote= this.recuperarLote(event);
    if(lote != null && !isNaN(lote)){
      this.lote = this.arrayLotes.find((x: any) => x.iLote == lote);
      if(this.lote.iStatus != 1){
        $(".details").hide();
      }
    }else{
      $(".details").hide();
    }
  }

  calcularCotizacion(plazo : any) {
    let precioM2Interes = this.lote.iPrecioM2Contado + (this.lote.iPrecioM2Contado * (plazo.iInteres / 100));
    this.precioM2 = precioM2Interes;
    this.precioTotalCotizado= this.lote.iSuperficie * precioM2Interes;
  }

  calcularMensualidad() {
    if(this.iMinEnganche < 20) {
      this.iMinEnganche = this.etapaSeleccionada.iMinEnganche;
      this.calcularMensualidad();
      return;
    }
    this.precioEnganche = this.precioTotal * (this.iMinEnganche/100);
    this.precioMensualidad = (this.precioTotal - this.precioEnganche) / this.plazoSeleccionado.iNoPlazo;
  }

  abrirModal(event : any) {
    let lote= this.recuperarLote(event);    
    if(lote != null) {
      this.lote = this.arrayLotes.find((x: any) => x.iLote == lote);
      if(this.lote.iStatus == 1){
        this.precioM2 = this.lote.iPrecioM2Contado;
        this.precioTotal = this.lote.iSuperficie * this.lote.iPrecioM2Contado;
        this.precioTotalCotizado = this.lote.iSuperficie * this.lote.iPrecioM2Contado;
        this.obtenerPlazosPorEtapa(this.arrayEtapas[0].iIdEtapa);
        this.openModal();
      }      
    }
    
  }

  recuperarLote(event : any) {
    let arrayString= (event.target.nextSibling.outerHTML).split('>');
    let lote=null;
    arrayString.forEach((element:string) => {
      element = element.replaceAll("</text", "");
      parseInt(element) ? lote = element : null;
    });
    return lote;
  }

  openModal(){
    this.modalService.open(this._modal, {centered: true, backdrop: false, fullscreen: true });
  }

  get f() {
    return this.form.controls;
  }
}
