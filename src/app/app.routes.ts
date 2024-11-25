import { Routes } from '@angular/router';
import { unloggedGuard } from './core/guard/unlogin.guard';
import { LoginComponent } from './login/login.component';
import { authGuard } from './core/guard/login.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [unloggedGuard],
        loadChildren: () => import('./cotizador/cotizador.module').then((m) => m.CotizadorModule)
    },
    {
        path: 'login',
        canActivate: [unloggedGuard],
        component: LoginComponent
    },
    {
        path: 'panel',
        canActivate: [authGuard],
        loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)
    },
    {
      path: '**',
      redirectTo: '', // Ruta por defecto o página 404
    }
];
