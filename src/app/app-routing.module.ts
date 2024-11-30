import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { userLoggedGuard } from './guards/userLoggedGuard';
import { userNotLoggedGuard } from './guards/userNotLoggedGuard';

const routes: Routes = [
  {
    path:"login",
    canActivate: [userNotLoggedGuard],
    loadChildren: ()=> import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path:"register",
    canActivate: [userNotLoggedGuard],
    loadChildren: ()=> import('./pages/register/register.module').then(m => m.RegisterModule)
  },
  {
    path:"converter",
    canActivate: [userLoggedGuard],
    loadChildren: ()=> import('./pages/converter/converter.module').then(m => m.ConverterModule)
  },
  {
    path:"plans",
    canActivate: [userLoggedGuard],
    loadChildren: ()=> import('./pages/plans/plans.module').then(m => m.PlansModule)
  },
  {
    path:"coins",
    canActivate: [userLoggedGuard],
    loadChildren: ()=> import('./pages/coins/coins.module').then(m => m.CoinsModule)
  },
  {
    path:"coin-detail/:currencyId",
    canActivate: [userLoggedGuard],
    loadChildren: ()=> import('./pages/coin-detail/coin-detail.module').then(m => m.CoinDetailModule)
  },
  {
    path: "",
    redirectTo: "converter",
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
