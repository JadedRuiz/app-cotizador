import { Routes } from '@angular/router';
import { unloggedGuard } from './core/guard/unlogin.guard';
import { CotizadorComponent } from './cotizador/cotizador.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {
        path: '',
        canActivate: [unloggedGuard],
        component: CotizadorComponent
    },
    {
        path: 'adm1n',
        canActivate: [unloggedGuard],
        component: LoginComponent
    },
    {
        path: 'panel',
        canActivate: [unloggedGuard],
        loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule)
    }
];
