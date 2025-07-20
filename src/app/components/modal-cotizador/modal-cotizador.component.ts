import { Component, ElementRef, HostListener, Inject, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselModule, NgbModal, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { CotizadorService } from '../../core/services/cotizador.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Cotizacion } from '../../core/models/cotizacion.model';
import { CommonModule, CurrencyPipe, NgClass, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-cotizador',
  standalone: true,
  imports: [
    CurrencyPipe,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgbCarouselModule
  ],
  templateUrl: './modal-cotizador.component.html',
  styleUrl: './modal-cotizador.component.css'
})
export class ModalCotizadorComponent {
  
  isCustomModalVisible  = false;
  @ViewChild('cotizadorModal') _modal: any;
  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;
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
  buttonEnv= {
    texto: 'Enviar',
    load: false,
    disabled: false
  };

  constructor(
    private _serCotizador: CotizadorService,
    private modalService: NgbModal,
    private _http: HttpClient,
    private _eleRef: ElementRef, 
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    // Inicializa cualquier funcionalidad si es necesario
    this.form = this._formBuilder.group({
      sNombre: ['', [Validators.required]],
      sApellidos: ['', [Validators.required]],
      sCorreo: ['', [Validators.required, Validators.email]],
      iTelefono: ['',[Validators.required, Validators.pattern("^[0-9]*$")]],
      sCiudad: ['', [Validators.required]]
    });
    this.cargaInicial();
  }

  cargaInicial() {
    this._serCotizador.arrayLotes$.subscribe((lotes) => {
      if(lotes.faseSeleccionada != null) {
        this.displayCustomModal(); // Usamos el nuevo método
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
        let nodos = $("#Capa_1").find('path');
        nodos.each((index : number, value : any) => {
          let poligono = $(value);
          let objLote = lotes.find((x : any) => $(value).attr("id")?.toLowerCase() == "apt"+x.iLote);
          if(objLote) {
            switch(objLote.iStatus) {
              //Disponible
              case 1:
                $(value).addClass('disponible');
                $(poligono).addClass('p-disponible');
                break;
              case 2:
                $(value).addClass('no-disponible');
                $(poligono).addClass('p-apartado');
                break;
              case 3:
                $(value).addClass('no-disponible');
                $(poligono).addClass('p-vendido');
                break;
            }
          }
        });
      });
    }
  }

  abrirModal(event : any) {
    let iLote= this.recuerarDepto(event); 
    if(iLote != null) {
      this.lote = this.arrayLotes.find((x: any) => iLote.includes(x.iLote));
      if(this.lote.iStatus && this.lote.iStatus == 1){
        // this.precioM2 = this.lote.iPrecioM2Contado;
        this.precioTotal = this.lote.iPrecioContado;
        this.iEnganche = 20;
        this.precioEnganche = this.precioTotal * (this.iEnganche/100); 
        this.precioFinanciado = this.precioTotal * (10/100);
        this.precioContraEntrega = this.precioTotal - (this.precioFinanciado + this.precioEnganche);
        this.obtenerPlazosPorEtapa(this.faseSeleccionada.iIdEtapa);
        this.openModal();
      }      
    }
  }

  mostrarDetalle(event : any) {  
    let iLote= this.recuerarDepto(event);
    if(iLote != null && iLote != undefined) {
      this.lote = this.arrayLotes.find((x: any) => iLote == x.iLote);
      if(this.lote && this.lote.iStatus == 1){
        console.log(this.lote);
        $(".details").css({
          'top': $("#apt"+this.lote.iLote).position().top-75,
          'left': $("#apt"+this.lote.iLote).position().left
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
    let iLote= this.recuerarDepto(event);
    if(iLote != null && iLote != undefined){
      this.lote = this.arrayLotes.find((x: any) => iLote == x.iLote);
      if(this.lote && this.lote.iStatus != 1){
        $(".details").hide();
      }
    }else{
      $(".details").hide();
    }
  }

  recuerarDepto(event : any) {
    if(event && event.target.id != "svgContainerDeptos" && event.target.id != "Capa_1" && event.target.id != "image1" &&
      event.target.localName != "eclipse" && event.target.localName != "text" && event.target.localName != "tspan"
    ) { 
      return event.target.id.replace(/^apt/, "");
    }
    return null;
  }

  // Métodos para mostrar/ocultar el modal
  displayCustomModal() {
    this.isCustomModalVisible = true;
    document.body.style.overflow = 'hidden'; // Deshabilita el scroll
  }

  hideCustomModal() {
    this.isCustomModalVisible = false;
    document.body.style.overflow = ''; // Restaura el scroll
  }

  openModal(){
    this.modalService.open(this._modal, {centered: true, backdrop: false, fullscreen: true });
  }

  obtenerPlazosPorEtapa(iIdEtapa : number) {
    this._serCotizador.obtenerPlazosPorEtapa(iIdEtapa)
    .subscribe((resp : any) => {
      if(resp.ok) {
        this.lote.objPlazos = resp.data;
        this.precioMensualidad = this.precioFinanciado / this.lote.objPlazos[0].iNoPlazo;
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
      // this.precioM2 = this.lote.iPrecioM2Contado;
      this.precioTotal = this.lote.iPrecioContado;
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
    console.log(this.lote.objPlazos[0].iNoPlazo);
    if(iEnganche == 1) {
        this.iMinEnganche = 10;
        this.iEnganche = 20;
        this.precioEnganche = this.precioTotal * (20/100); 
        this.precioFinanciado = this.precioTotal * (10/100);
        this.precioMensualidad = this.precioFinanciado / this.lote.objPlazos[0].iNoPlazo;
        this.precioContraEntrega = this.precioTotal - (this.precioFinanciado + this.precioEnganche);
      return;
    }
    if(iEnganche == 2) {
        this.iMinEnganche = 20;
        this.iEnganche = 30;
        this.precioEnganche = this.precioTotal * (30/100); 
        this.precioFinanciado = this.precioTotal * (20/100);
        this.precioMensualidad = this.precioFinanciado / this.lote.objPlazos[0].iNoPlazo;
        this.precioContraEntrega = this.precioTotal - (this.precioFinanciado + this.precioEnganche);
      return;
    }
    if(iEnganche == 3) {
        this.iMinEnganche = 40;
        this.iEnganche = 50;
        this.precioEnganche = this.precioTotal * (50/100); 
        this.precioFinanciado = this.precioTotal * (40/100);
        this.precioMensualidad = this.precioFinanciado / this.lote.objPlazos[0].iNoPlazo;
        this.precioContraEntrega = this.precioTotal - (this.precioFinanciado + this.precioEnganche);
      return;
    }
  }

  get f() {
    return this.form.controls;
  }
}
