import { Routes } from '@angular/router';
import { unloggedGuard } from './core/guard/unlogin.guard';
import { authGuard } from './core/guard/login.guard';
import { CotizadorComponent } from './cotizador/cotizador.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [unloggedGuard],
        component: CotizadorComponent
    },
];
