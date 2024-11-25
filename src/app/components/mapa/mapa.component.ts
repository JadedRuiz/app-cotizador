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
import { LoteService } from '../../core/services/lote.service';
import { EtapaService } from '../../core/services/etapa.service';

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
  bCotizacion=true;
  form!: FormGroup;
  @ViewChild('cotizadorModal') _modal: any;
  precioM2=0;
  precioTotal= 0;
  precioFinanciado= 0;
  precioContraEntrega=0;
  precioEnganche=0;
  precioMensualidad=0;
  arrayEtapas: any;
  arrayLotes: any;
  iMinEnganche = 0;
  iEnganche=0;
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
    private _servCotizador: CotizadorService,
    private _etapaService: EtapaService,
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      sNombre: ['', [Validators.required]],
      sCorreo: ['', [Validators.required, Validators.email]],
      iTelefono: ['',[Validators.required, Validators.pattern("^[0-9]*$")]],
      sCiudad: ['', [Validators.required]]
    });
    this.cargaInicial();
    this.actualizarLotes();
  }

   cargaInicial() {
    this._etapaService.obtenerEtapas()
    .subscribe((resp: any) => {
      if(resp.ok){
        this._etapaService.arrayEtapas$.next(resp.data);
        this.arrayEtapas = resp.data;
        this.etapaSeleccionada = resp.data[0];
        this.iMinEnganche = resp.data[0].iMinEnganche;
      }
    });
  }

  actualizarLotes() {
    this._servCotizador.arrayLotes$.subscribe((data : any) => {
      this.arrayLotes = data;
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
    this.cotizacion.iIdPlazo=6;
    this.cotizacion.iEnganche=this.iEnganche;
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
      // this.precioTotalCotizado = this.lote.iSuperficie * this.lote.iPrecioM2Contado;
      this.bCotizacion=false;
  }

  mostrarDetalle(event : any) {  
    let sTipoLote= this.recuperarLote(event);
    if(sTipoLote != null) {
      this.lote = this.arrayLotes.find((x: any) => x.sTipoLote == sTipoLote);
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
    let sTipoLote= this.recuperarLote(event);
    if(sTipoLote != null){
      this.lote = this.arrayLotes.find((x: any) => x.sTipoLote == sTipoLote);
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
    // this.precioTotalCotizado= this.lote.iSuperficie * precioM2Interes;
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
    let sTipoLote= this.recuperarLote(event);   
    console.log(sTipoLote); 
    if(sTipoLote != null) {
      this.lote = this.arrayLotes.find((x: any) => x.sTipoLote == sTipoLote);
      if(this.lote.iStatus == 1){
        this.precioM2 = this.lote.iPrecioM2Contado;
        this.precioTotal = this.lote.iSuperficie * this.lote.iPrecioM2Contado;
        this.iEnganche = 20;
        this.precioEnganche = this.precioTotal * (this.iEnganche/100); 
        this.precioFinanciado = this.precioTotal * (10/100);
        this.precioMensualidad = this.precioFinanciado / 42;
        this.precioContraEntrega = this.precioTotal - (this.precioFinanciado + this.precioEnganche);
        this.obtenerPlazosPorEtapa(this.arrayEtapas[0].iIdEtapa);
        this.openModal();
      }      
    }
  }

  recuperarLote(event : any) {
    if(event && event.target.localName != "app-svg" && event.target.nextElementSibling != null) { 
      let arrayString= (event.target.nextElementSibling.outerHTML).split('>');  
      let sTipoLote = arrayString[1].replaceAll("</text", "");
      if(sTipoLote.includes("NIVEL") || sTipoLote.includes("rect")) {
        return null;
      }
      return sTipoLote;
    }
    return null;
  }

  openModal(){
    this.modalService.open(this._modal, {centered: true, backdrop: false, fullscreen: true });
  }

  get f() {
    return this.form.controls;
  }


  seleccionarEnganche(iEnganche : any) {
    if(iEnganche == 1) {
        this.iMinEnganche = 10;
        this.iEnganche = 20;
        this.precioEnganche = this.precioTotal * (20/100); 
        this.precioFinanciado = this.precioTotal * (10/100);
        this.precioMensualidad = this.precioFinanciado / 42;
        this.precioContraEntrega = this.precioTotal - (this.precioFinanciado + this.precioEnganche);
      return;
    }
    if(iEnganche == 2) {
        this.iMinEnganche = 20;
        this.iEnganche = 30;
        this.precioEnganche = this.precioTotal * (30/100); 
        this.precioFinanciado = this.precioTotal * (20/100);
        this.precioMensualidad = this.precioFinanciado / 42;
        this.precioContraEntrega = this.precioTotal - (this.precioFinanciado + this.precioEnganche);
      return;
    }
    if(iEnganche == 3) {
        this.iMinEnganche = 40;
        this.iEnganche = 50;
        this.precioEnganche = this.precioTotal * (50/100); 
        this.precioFinanciado = this.precioTotal * (40/100);
        this.precioMensualidad = this.precioFinanciado / 42;
        this.precioContraEntrega = this.precioTotal - (this.precioFinanciado + this.precioEnganche);
      return;
    }
  }
}
