import { Component } from '@angular/core';
import { Plazo } from '../../core/models/plazo.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-plazo',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './form-plazo.component.html',
  styleUrl: './form-plazo.component.css'
})
export class FormPlazoComponent {  
  submittedPlazo= false;
  plazo = new Plazo();



  nuevoPlazoLote() {
    this.submittedPlazo = true;

    if(!this.plazo.isValid()) {
      return;
    }

    // this.lote.objPlazos.push(this.plazo);
    this.plazo = new Plazo();
    this.submittedPlazo = false;
  }
} 
