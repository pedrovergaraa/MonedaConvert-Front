import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConverterComponent } from './pages/converter/converter.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [
  {
    path:"login",
    //canActivate: [usuarioSinLoguear],
    loadChildren: ()=> import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path:"register",
    //canActivate: [usuarioSinLoguear],
    loadChildren: ()=> import('./pages/register/register.module').then(m => m.RegisterModule)
  },
  {
    path:"converter",
    //canActivate: [usuarioLogueadoGuard],
    loadChildren: ()=> import('./pages/converter/converter.module').then(m => m.ConverterModule)
  },
  {
    path:"plans",
    //canActivate: [usuarioLogueadoGuard],
    loadChildren: ()=> import('./pages/plans/plans.module').then(m => m.PlansModule)
  },
  {
    path:"coins",
    //canActivate: [usuarioLogueadoGuard],
    loadChildren: ()=> import('./pages/coins/coins.module').then(m => m.CoinsModule)
  },
  {
    path:"coin-detail",
    //canActivate: [usuarioLogueadoGuard],
    loadChildren: ()=> import('./pages/coin-detail/coin-detail.module').then(m => m.CoinDetailModule)
  },
  {
    path:"",
    //canActivate: [usuarioLogueadoGuard],
    loadChildren: ()=> import('./pages/coins/coins.module').then(m => m.CoinsModule)
  },
  {
    path: "",
    redirectTo: 'converter',
    pathMatch: "full"
  },
  // {
  //   path:"**",
  //   //loadChildren: ()=> import('./pages/error/error.module').then(m => m.ErrorModule)
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
