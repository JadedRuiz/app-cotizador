import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapse, NgbCollapseModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { CurrencyPipe } from '@angular/common';

import { Etapa } from '../../core/models/etapa.model';
import { NgIf } from '@angular/common';
import { Plazo } from '../../core/models/plazo.model';
import { LoteForm } from '../../core/models/lote.form.model';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbCollapseModule,
    NgbDropdownModule,
    RxReactiveFormsModule,
    NgIf,
    CurrencyPipe,
    NgbTooltipModule
  ],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.css'
})
export class ProyectosComponent {
  isCollapsed = true;
  isCollapsedLote = false;
  submitted = false;
  submittedLote= false;
  submittedPlazo= false;
  @ViewChild('collapse') collapse ?: NgbCollapse ;
  formEtapa !: FormGroup;
  formLote !: FormGroup;
  arrayEtapas: Etapa[] = [
    {
      sEtapa: "Etapa No.6",
      iEtapa: 6,
      sSvg: "/assets/Imagenes/img-default.png",
      iTotalLotes: 0,
      bActivo: true,
      bActive: true
    }
  ];
  arrayLotes: LoteForm[] = [];
  arrayPlazos: Plazo[] = [];
  etapaSeleccionada = {
    seleccionado: true,
    etapa: new Etapa,
    lotes: this.arrayLotes
  }
  
  plazo = new Plazo();
  lote = new LoteForm();

  constructor(private _formBuilder: RxFormBuilder) { }

  ngOnInit() {
    this.formEtapa = this._formBuilder.formGroup(Etapa);
    this.formLote = this._formBuilder.formGroup(LoteForm);
    this.formLote.controls['iMinEnganche'].disable();
  }

  nuevaEtapa() {
    this.submitted = true;
    if(!this.formEtapa.valid) {
      return;
    }
    //Aqui se guarda en la BD
    //Se agrega al Arreglo
    this.formEtapa.controls["bActive"].setValue(true);
    this.etapaSeleccionada.seleccionado = true;
    this.etapaSeleccionada.etapa = this.formEtapa.value;
    this.arrayEtapas.push(this.formEtapa.value);
    this.formEtapa.reset();
    this.submitted=false;
    this.collapse?.toggle(false);
  }

  editar(data : any) {
    this.collapse?.toggle(true);
  }

  nuevoLote() {
    this.submittedLote= true;
    if(!this.formLote.valid){
      return;
    }
    
    this.lote.sLote = this.formLote.controls['sLote'].value;
    this.lote.sSuperficie = this.formLote.controls['sSuperficie'].value;
    this.lote.sAncho = this.formLote.controls['sAncho'].value;
    this.lote.sLargo = this.formLote.controls['sLargo'].value;
    this.lote.iMinEnganche = this.formLote.controls['iMinEnganche'].value;
    // this.etapaSeleccionada.etapa.iTotalLotes++;
    this.arrayLotes.push(this.lote);
    console.log(this.lote);
  }

  cambiarStatusLote() {
    
  }

  nuevoPlazoLote() {
    this.submittedPlazo = true;

    if(!this.plazo.isValid()) {
      return;
    }

    this.lote.objPlazos.push(this.plazo);
    this.plazo = new Plazo();
    this.submittedPlazo = false;
  }
}
