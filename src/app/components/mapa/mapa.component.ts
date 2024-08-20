import { Component, ElementRef, ViewChild } from '@angular/core';
import { SvgComponent } from '../svg/svg.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Cotizacion } from '../../core/models/cotizacion.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SvgComponent,
    NgClass,
    NgIf,
    CurrencyPipe
  ],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.css'
})
export class MapaComponent {

  cotizacion= new Cotizacion();
  submitted = false;
  form!: FormGroup;
  @ViewChild('cotizadorModal') _modal: any;
  precioTotal= 0;

  constructor(private modalService: NgbModal, private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      sNombre: ['', [Validators.required]],
      sCorreo: ['', [Validators.required, Validators.email]],
      iTelefono: ['',[Validators.required, Validators.maxLength(10)]],
      sCiudad: ['', [Validators.required]]
    });
  }

  registrarCotizacion() {
    this.submitted = true;
    // Validar formulario
    console.log(this.submitted, this.f['sNombre'].errors);
    if (this.form.invalid) {
      return;
    }
  }

  abrirModal(event : any) {
    let arrayString= (event.target.nextSibling.outerHTML).split('>');
    let lote="";
    arrayString.forEach((element:string) => {
      element = element.replaceAll("</text", "");
      parseInt(element) ? lote= element : null;
    });
    this.cotizacion.lote.sNombre= "LOTE "+lote+"-6";
    this.cotizacion.lote.sEtapa= "AVENIDA - ETAPA 6";
    let preciom2= this.cotizacion.lote.objPlazos[0].sPrecioM2.replaceAll('$','');
    let arrayDimensiones= this.cotizacion.lote.sDimension.split(' ');
    let mulDimensiones= parseFloat(arrayDimensiones[0]) * parseFloat(arrayDimensiones[2]);
    console.log(preciom2, arrayDimensiones, mulDimensiones);
    this.precioTotal= mulDimensiones* parseFloat(preciom2);

    this.openModal();
  }

  openModal(){
    this.modalService.open(this._modal, {centered: true, backdrop: false });
  }

  get f() {
    return this.form.controls;
  }
}
