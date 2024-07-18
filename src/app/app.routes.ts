import { Routes } from '@angular/router';
import { SigninComponent } from './Login/signin/signin.component';
import { SignupComponent } from './Login/signup/signup.component';
import { RegisterPropertyComponent } from './Property/register-property/register-property.component';
import { PropertyListingComponent } from './Property/property-listing/property-listing.component';
import { MainComponent } from './common/main/main/main.component';
import { AuthGuard } from './Auth/auth.guard';
import { CartComponent } from './Property/cart/cart.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/signin',
        pathMatch: 'full'
    },
    {
        path: 'main',
        component: MainComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                redirectTo: 'propertylisting',
                pathMatch: 'full'
            },
            {
                path: 'registerproperty',
                component: RegisterPropertyComponent
            },
            {
                path: 'propertylisting',
                component: PropertyListingComponent
            },
            {
                path: 'cart',
                component: CartComponent
            },
        ]
    },
    {
        path: 'signin',
        component: SigninComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: '**',
        redirectTo: '/signin'
    }
];
