
import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Showroom } from './components/showroom/showroom';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        title: 'CALI STORE'
    },
    {
        path: 'login',
        component: Login,
        title: 'Accedi - CALI STORE'
    },
    {
        path: 'showroom',
        component: Showroom,
        title: 'Showroom Funko Pop - CALI STORE'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
