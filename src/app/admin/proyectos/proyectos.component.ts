import { Component, ElementRef, ViewChild } from '@angular/core';
import { Form, FormGroup, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapse, NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { Etapa } from '../../core/models/etapa.model';
import { NgIf } from '@angular/common';
import { Lote } from '../../core/models/lote.model';
import { PlazoForm } from '../../core/models/plazo.form.model';
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
    NgIf
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
  arrayLotes: Lote[] = [];
  etapaSeleccionada = {
    seleccionado: false,
    etapa: new Etapa,
    lotes: this.arrayLotes
  }
  
  plazo = new PlazoForm();
  lote = new LoteForm();

  constructor(private _formBuilder: RxFormBuilder) { }

  ngOnInit() {
    this.formEtapa = this._formBuilder.formGroup(Etapa);
    this.formLote = this._formBuilder.formGroup(LoteForm);
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
    console.log(this.formLote.value);
  }
}
