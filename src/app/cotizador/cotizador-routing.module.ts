import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CotizadorComponent } from './cotizador.component';
import { FaseComponent } from '../components/fase/fase.component';

const routes: Routes = [
  {
    path: '',
    component: CotizadorComponent,
    children: [
      {
        path: '',
        component: FaseComponent,
        data: { animation: '' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizadorRoutingModule { }
