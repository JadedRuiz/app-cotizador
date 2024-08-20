import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteEvidendeciaComponent } from './reporte-evidendecia/reporte-evidendecia.component';

const routes: Routes = [
  {
    path: 'reporte_evidencia',
    component: ReporteEvidendeciaComponent  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
