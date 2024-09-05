import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-modal-interesados',
  standalone: true,
  imports: [],
  templateUrl: './modal-interesados.component.html',
  styleUrl: './modal-interesados.component.css'
})
export class ModalInteresadosComponent {
  activeModal = inject(NgbActiveModal);
	@Input() iIdLote?: any;
  arrayInteresados: any;
  constructor(
    private _serAdmin: AdminService
  ) {}

  ngOnInit() {
    this.cargaInicial();
  }

  cargaInicial() {
    this._serAdmin.obtenerCotizacionesLote({ iIdLote: this.iIdLote })
    .subscribe((res : any) => {
      this.arrayInteresados = res;
    })
  }

  collapse(indexRow : any) {
    for(let i=0; i<this.arrayInteresados.length; i++) {
      this.arrayInteresados[i].collapse = false;
    }
    this.arrayInteresados[indexRow].collapse = true;
  }
}
