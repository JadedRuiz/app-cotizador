import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapse, NgbCollapseModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { Etapa } from '../../core/models/etapa.model';
import { NgIf } from '@angular/common';
import { Lote } from '../../core/models/lote.model';

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
  submitted = false;
  @ViewChild('collapse') collapse ?: NgbCollapse ;
  formEtapa !: FormGroup;
  arrayEtapas : Etapa[] = [];
  objLote!: Lote;
  loteSeleccionado= {
    seleccionado: false,
    titulo: "SELECCIONE UNA ETAPA, PARA MOSTRAR SUS LOTES",
  };

  constructor(private _formBuilder: RxFormBuilder) { }

  ngOnInit() {
    this.formEtapa = this._formBuilder.formGroup(Etapa);
    console.log(this.formEtapa.value);
  }

  guardarEtapa() {
    this.submitted = true;
    if(!this.formEtapa.valid) {
      return;
    }
    //Aqui se guarda en la BD
    //Se agrega al Arreglo
    this.formEtapa.controls["bActive"].setValue(true);
    this.arrayEtapas.push(this.formEtapa.value);
    this.loteSeleccionado.seleccionado= true;
    this.loteSeleccionado.titulo= this.formEtapa.controls["sEtapa"].value + "- LOTES";
    this.formEtapa.reset();
    this.submitted=false;
  }

  editar(data : any) {
    console.log(data);
    this.collapse?.toggle(true);
  }
}
