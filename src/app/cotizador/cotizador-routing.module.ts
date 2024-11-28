import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CotizadorComponent } from './cotizador.component';
import { FaseComponent } from '../components/fase/fase.component';
import { SubfaseComponent } from '../components/subfase/subfase.component';

const routes: Routes = [
  {
    path: '',
    component: CotizadorComponent,
    children: [
      // {
      //   path: 'fase',
      //   component: FaseComponent,
      //   data: { animation: 'FasePage' }
      // },
      {
        path: 'subfase',
        component: SubfaseComponent,
        data: { animation: '' } // Esta ruta tiene 'animation', por lo tanto, se animará
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotizadorRoutingModule { }
