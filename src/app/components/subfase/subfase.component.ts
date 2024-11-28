import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoteService } from '../../core/services/lote.service';
import { CotizadorService } from '../../core/services/cotizador.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule, CurrencyPipe, NgClass, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cotizacion } from '../../core/models/cotizacion.model';
import Swal from 'sweetalert2';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-subfase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    CurrencyPipe,
    NgIf
  ],
  templateUrl: './subfase.component.html',
  styleUrl: './subfase.component.css'
})
export class SubfaseComponent {

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
  @ViewChild('cotizadorModal') _modal: any;
  buttonEnv= {
    texto: 'Enviar',
    load: false,
    disabled: false
  };
  isLoading = this.LoadingService.loading$;

  constructor(
    private _serCotizador: CotizadorService,
    private _ser: LoteService,
    private _http: HttpClient,
    private _eleRef: ElementRef, 
    private _formBuilder: FormBuilder,
    private modalService: NgbModal,
    private LoadingService: LoadingService
  ) {}

  ngOnInit() : void {
    // this.LoadingService.show();
    this.form = this._formBuilder.group({
      sNombre: ['', [Validators.required]],
      sCorreo: ['', [Validators.required, Validators.email]],
      iTelefono: ['',[Validators.required, Validators.pattern("^[0-9]*$")]],
      sCiudad: ['', [Validators.required]]
    });
    this.cargaInicial();
  }

  cargaInicial() {
    this._serCotizador.arrayLotes$.subscribe((lotes) => {
      if(lotes != undefined) {
        this.arrayLotes = lotes.objLotes;
        this.faseSeleccionada = lotes.faseSeleccionada;
        this.iMinEnganche = lotes.faseSeleccionada.iMinEnganche;
        this.loadDeptosSvg(lotes.objLotes);
        // this.LoadingService.hide(); 
      }    
    });
  }

  loadDeptosSvg(lotes : any) {
    if(this.faseSeleccionada != undefined) {
      this._http.get(this.faseSeleccionada.sPath, { responseType: 'text'}).subscribe(
        (svgContent: string) => {
        const container = this._eleRef.nativeElement.querySelector("#svgContainer");
        container.innerHTML = svgContent;
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

  abrirModal(event : any) {
    let sTipoLote= this.recuerarDepto(event); 
    if(sTipoLote != null) {
      this.lote = this.arrayLotes.find((x: any) => sTipoLote.includes(x.sTipoLote));
      if(this.lote.iStatus && this.lote.iStatus == 1){
        this.precioM2 = this.lote.iPrecioM2Contado;
        this.precioTotal = this.lote.iSuperficie * this.lote.iPrecioM2Contado;
        this.iEnganche = 20;
        this.precioEnganche = this.precioTotal * (this.iEnganche/100); 
        this.precioFinanciado = this.precioTotal * (10/100);
        this.precioMensualidad = this.precioFinanciado / 42;
        this.precioContraEntrega = this.precioTotal - (this.precioFinanciado + this.precioEnganche);
        this.obtenerPlazosPorEtapa(this.faseSeleccionada.iIdEtapa);
        this.openModal();
      }      
    }
  }

  mostrarDetalle(event : any) {  
    let sTipoLote= this.recuerarDepto(event);
    if(sTipoLote != null && sTipoLote != undefined) {
      this.lote = this.arrayLotes.find((x: any) => sTipoLote.includes(x.sTipoLote));
      if(this.lote && this.lote.iStatus == 1){
        $(".details").css({
          'top': $(".lote-"+this.lote.iLote).position().top-80,
          'left': $(".lote-"+this.lote.iLote).position().left
        });
        $(".details").show();
      }else{
        $(".details").hide();
      }
    }else {
      $(".details").hide();
    }    
  }

  esconderDetalle(event : any){
    let sTipoLote= this.recuerarDepto(event);
    if(sTipoLote != null && sTipoLote != undefined){
      this.lote = this.arrayLotes.find((x: any) => sTipoLote.includes(x.sTipoLote));
      if(this.lote && this.lote.iStatus != 1){
        $(".details").hide();
      }
    }else{
      $(".details").hide();
    }
  }

  recuerarDepto(event : any) {
    if(event && event.target.localName != "app-svg" && event.target.nextElementSibling != null) { 
      let arrayString= (event.target.nextElementSibling.outerHTML).split('>');  
      let sTipoLote = arrayString[1].replaceAll("</text", "");
      if(!sTipoLote.includes("<p")) {
        return sTipoLote;
      }
    }
    return null;
  }

  // Modal Cotizador
  obtenerPlazosPorEtapa(iIdEtapa : number) {
    this._serCotizador.obtenerPlazosPorEtapa(iIdEtapa)
    .subscribe((resp : any) => {
      if(resp.ok) {
        this.lote.objPlazos = resp.data;
        console.log(this.lote);
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
    this._serCotizador.guardarCotizacion(this.cotizacion)
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

  calcularCotizacion(plazo : any) {
    let precioM2Interes = this.lote.iPrecioM2Contado + (this.lote.iPrecioM2Contado * (plazo.iInteres / 100));
    this.precioM2 = precioM2Interes;
    // this.precioTotalCotizado= this.lote.iSuperficie * precioM2Interes;
  }

  calcularMensualidad() {
    if(this.iMinEnganche < 20) {
      this.iMinEnganche = this.faseSeleccionada.iMinEnganche;
      this.calcularMensualidad();
      return;
    }
    this.precioEnganche = this.precioTotal * (this.iMinEnganche/100);
    this.precioMensualidad = (this.precioTotal - this.precioEnganche) / this.plazoSeleccionado.iNoPlazo;
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

  get f() {
    return this.form.controls;
  }

  openModal(){
    this.modalService.open(this._modal, {centered: true, backdrop: false, fullscreen: true });
  }
}
