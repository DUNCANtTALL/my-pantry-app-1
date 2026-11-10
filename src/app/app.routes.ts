import { Routes } from '@angular/router';
import { AddProductComponent } from './add-product/add-product.component';
import { Stock } from './stock/stock';
import { Login } from './login/login';
import { SignIn } from './sign-in/sign-in';

export const routes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'stock', component: Stock },
		{ path: 'login', component: Login },
		{ path: 'sign-in', component: SignIn },
	{ path: 'add-product', component: AddProductComponent },
	{ path: '**', redirectTo: 'login' },
];
