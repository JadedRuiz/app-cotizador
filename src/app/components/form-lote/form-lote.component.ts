import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyPipe, NgIf } from '@angular/common';
import { Lote } from '../../core/models/lote.model';
import { LoteService } from '../../core/services/lote.service';

@Component({
  selector: 'app-form-lote',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgIf,
    CurrencyPipe
  ],
  templateUrl: './form-lote.component.html',
  styleUrl: './form-lote.component.css'
})
export class FormLoteComponent {
  lote = new Lote();
  imageUrl:  string | ArrayBuffer | null = "./assets/Imagenes/img-default.png";
  image: any = null;
  precioContado= 0;

  constructor(
    private _loteService: LoteService
  ) {}

  ngOnInit(): void {
    this._loteService.lote$.subscribe((lote) => {
      this.lote = lote;
      this.calcularTotal();
    });
  }

  guardarLote() {
    let json = {
      lote: this.lote,
      image: this.imageUrl
    };
    var formdata = new FormData();
    for(const [key, value] of Object.entries(this.lote)) {
      formdata.append(key,value);
    }
    formdata.append("image",this.image);
    this._loteService.guardarLote(formdata)
    .subscribe((res) => {
      if(res.ok) {
        console.log(res.data);
      }
    }, (message) => {
      console.log(message);
    });
  }

  calcularTotal() {
    if(this.lote.iSuperficie != undefined && this.lote.iPrecioM2Contado != undefined) {
      this.precioContado = this.lote.iSuperficie * this.lote.iPrecioM2Contado;
      return;
    }
    this.lote.iSuperficie = 0;
    this.lote.iPrecioM2Contado = 0;
  }

  alerta(message: string) {

  }

  adjuntarImagen() {
    document.getElementById("adjimgLote")?.click();
  }

  convertirImagen(event : Event): void {
    const input = event.target as HTMLInputElement;

    if(input.files && input.files.length) {
      this.image = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imageUrl = reader.result;
      };

      reader.readAsDataURL(this.image);
    }
  }
}
