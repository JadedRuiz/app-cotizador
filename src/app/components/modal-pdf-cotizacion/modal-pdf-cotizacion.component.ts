import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-pdf-cotizacion',
  standalone: true,
  imports: [],
  templateUrl: './modal-pdf-cotizacion.component.html',
  styleUrl: './modal-pdf-cotizacion.component.css'
})

export class ModalPdfCotizacionComponent {
  activeModal = inject(NgbActiveModal);
	@Input() sArchivo?: any;

  constructor() {}

}
