import { Routes } from '@angular/router';
import { unloggedGuard } from './core/guard/unlogin.guard';
import { CotizadorComponent } from './cotizador/cotizador.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './core/guard/login.guard';

export const routes: Routes = [
    {
        path: '',
        component: CotizadorComponent
    },
    {
        path: 'adm1n',
        canActivate: [unloggedGuard],
        component: LoginComponent
    },
    {
        path: 'panel',
        canActivate: [authGuard],
        loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)
    }
];
