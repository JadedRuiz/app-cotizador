import { Component, inject, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapse, NgbCollapseModule, NgbDropdownModule, NgbModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RxFormBuilder, RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { CurrencyPipe } from '@angular/common';

import { Etapa } from '../../core/models/etapa.model';
import { NgIf } from '@angular/common';
import { Plazo } from '../../core/models/plazo.model';
import { AdminService } from '../../core/services/admin.service';
import Swal from 'sweetalert2';
import { FormLoteComponent } from '../../components/form-lote/form-lote.component';
import { FormPlazoComponent } from '../../components/form-plazo/form-plazo.component';
import { Lote } from '../../core/models/lote.model';
import { CotizadorService } from '../../core/services/cotizador.service';
import { ModalInteresadosComponent } from '../../components/modal-interesados/modal-interesados.component';

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
    NgbTooltipModule,
    FormLoteComponent,
    FormPlazoComponent
  ],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.css'
})
export class ProyectosComponent {
  private modalService = inject(NgbModal);
  isCollapsed = true;
  isCollapsedLote = false;
  submitted = false;
  submittedPlazo= false;
  @ViewChild('collapse') collapse ?: NgbCollapse ;
  formEtapa !: FormGroup;
  formLote !: FormGroup;
  arrayEtapas: Etapa[] = [];
  arrayLotes: Lote[] = [];
  arrayPlazos: Plazo[] = [];
  etapa!: Etapa;

  constructor(
    private _formBuilder: RxFormBuilder,
    private _serAdmin: AdminService,
    private _cotAdmin: CotizadorService
  ) { }

  ngOnInit() {
    this.formEtapa = this._formBuilder.formGroup(Etapa);
    // this.formLote.controls['iMinEnganche'].disable();
    this.cargaInicial();
  }

  ngAfterViewInit() {
  }

  cargaInicial() {
    this._serAdmin.obtenerEtapasAdmin()
    .subscribe((res : any) => {
      if(res.ok) {
        this.arrayEtapas=res.data;
        this.etapa= res.data[0];
        this.obtenerLotesXEtapa(res.data[0].iIdEtapa);
        this.obtenerPlazosEtapa(res.data[0].iIdEtapa)
        return;
      }
      Swal.fire("Ha ocurrido un problema",res.data,"warning");
    });
  }

  obtenerLotesXEtapa(iIdEtapa: number) {
    this._serAdmin.obtenerLotesEtapaAdmin(iIdEtapa)
    .subscribe((res : any) => {
      if(res.ok) {
        this.arrayLotes = res.data.lotes;
      }
    });
  }
  
  obtenerPlazosEtapa(iIdEtapa: number) {
    this._cotAdmin.obtenerPlazosPorEtapa(iIdEtapa)
    .subscribe((res : any) => {
      if(res.ok){
        this.arrayPlazos= res.data;
      }
    })
  }
  nuevaEtapa() {
    this.submitted = true;
    if(!this.formEtapa.valid) {
      return;
    }
    //Aqui se guarda en la BD
    //Se agrega al Arreglo
    this.formEtapa.controls["bActive"].setValue(true);
    // this.etapaSeleccionada.seleccionado = true;
    // this.etapaSeleccionada.etapa = this.formEtapa.value;
    this.arrayEtapas.push(this.formEtapa.value);
    this.formEtapa.reset();
    this.submitted=false;
    this.collapse?.toggle(false);
  }

  editar(data : any) {
    this.collapse?.toggle(true);
  }

  cambiarStatus(index : number, iIdLote : any, iStatus : number) {
    this._serAdmin.cambiarStatusLote({iIdLote: iIdLote, iStatus: iStatus})
    .subscribe((resp : any) => {
      if(resp.ok) {
        this.arrayLotes[index].iStatus = iStatus;
        return;
      }
      Swal.fire("Operación no realizada",resp.data,"warning");
    });    
  }

  calcular(id : any) {

  }

  open(iIdLote : any) {
		const modalRef = this.modalService.open(ModalInteresadosComponent, { centered: true });
		modalRef.componentInstance.iIdLote = iIdLote;
	}
}
