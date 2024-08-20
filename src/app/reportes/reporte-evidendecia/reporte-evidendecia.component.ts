import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReporteService } from '../../core/services/reporte.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-reporte-evidendecia',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './reporte-evidendecia.component.html',
  styleUrl: './reporte-evidendecia.component.css'
})
export class ReporteEvidendeciaComponent {
  //#region [Variables Globales]
    public i = 0;
    public json = {
      sTitulo: "",
      sCliente : "",
      sFecha: "",
      sEquipo: "",
      sReporte: "",
      objEvidencias: new Array()
    }
  //#endregion

  constructor(private _reporteService: ReporteService) { }

  nuevaEvidencia() {
    this.json.objEvidencias.push({
      index: this.i,
      sTitulo: '',
      sDescripcion: '',
      bImagenes: '',
      iTotalImagenes : 0,
      objImagenes: [
        {index: 1, namefile: '', file: ''},
        {index: 2, namefile: '', file: ''},
        {index: 3, namefile: '', file: ''},
        {index: 4, namefile: '', file: ''},
        {index: 5, namefile: '', file: ''}
      ],
      alerta: false
    });
    this.i++;
  }

  abrirExplorador(index: string, index_img : string) {
    document.getElementById("inpFile"+index+""+index_img)?.click();
  }

  guardarImagen(event : any, index: number, index_img : number) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const evidencia = this.json.objEvidencias.filter((x) => x.index == index);
      evidencia[0].iTotalImagenes++;
      const imagen = evidencia[0].objImagenes.filter((x : any) => x.index == index_img);
      imagen[0].namefile = event.target.files[0].name;
      imagen[0].file = reader.result;
    }
  }

  alertaImagen(index : number){
    let evidencia = this.json.objEvidencias.filter((x) => x.index == index);
    evidencia[0].alerta = true;
    setTimeout(()=> {
      evidencia[0].alerta = false;
    },3000)
  }

  guardarReporte(){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger mx-2"
      },
      buttonsStyling: false
    });
    if(this.json.objEvidencias.length > 0){
      swalWithBootstrapButtons.fire({
        title: "Estas seguro?",
        text: "El reporte será almacenado",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Guardar",
        showLoaderOnConfirm: true,
        cancelButtonText: "No, cancelar!",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "El reporte ha sido guardado",
            text: "Generando PDF, un momento...",
            showConfirmButton: false,
            timer: 30000
          });
          swalWithBootstrapButtons.showLoading();
          this._reporteService.guardarReporteEvidencia(this.json)
          .subscribe((res : any) => {
            if(res.ok) {
              Swal.close();
              let id = (res.id+"").length;
              let contador = 5 - id;
              let ceros= "";
              for(let i=0; i<contador; i++){
                ceros += "0";
              }
              ceros += res.id;
              let a = document.createElement("a");
              a.href = "data:application/octet-stream;base64,"+res.data;
              a.download = `RESCR${ceros}.pdf`
              a.click();
              this.json = {
                sTitulo: "",
                sCliente : "",
                sFecha: "",
                sEquipo: "",
                sReporte: "",
                objEvidencias: new Array()
              }              
            }else{
              Swal.fire("Ha ocurrido un error",res.message,"error");
            }
          })
          
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelado",
            text: "El reporte no ha sido guardado",
            icon: "error"
          });
        }
      });
    }else{
      Swal.fire("Ha ocurrido un error","No se puede guardar el reporte sin evidencias","warning")
    }
    
    
    
  }
}
