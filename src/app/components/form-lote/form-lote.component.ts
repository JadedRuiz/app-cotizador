import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { LoteForm } from '../../core/models/lote.form.model';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-form-lote',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule,
    NgbDropdownModule,
    NgIf
  ],
  templateUrl: './form-lote.component.html',
  styleUrl: './form-lote.component.css'
})
export class FormLoteComponent {
  public form!: FormGroup;
  submittedLote= false;
  lote = new LoteForm();

  constructor(
    private _formBuilder: RxFormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this._formBuilder.formGroup(LoteForm);
  }

  nuevoLote() {
    this.submittedLote= true;
    if(!this.form.valid){
      return;
    }
    
    this.lote.sLote = this.form.controls['sLote'].value;
    this.lote.sSuperficie = this.form.controls['sSuperficie'].value;
    this.lote.sAncho = this.form.controls['sAncho'].value;
    this.lote.sLargo = this.form.controls['sLargo'].value;
    this.lote.iMinEnganche = this.form.controls['iMinEnganche'].value;
    // this.etapaSeleccionada.etapa.iTotalLotes++;
    // this.arrayLotes.push(this.lote);
    console.log(this.lote);
  }
}
