import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlansRoutingModule } from './plans-routing.module';
import { PlansComponent } from './plans.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    PlansComponent
  ],
  imports: [
    CommonModule,
    PlansRoutingModule,
    HttpClientModule
  ]
})
export class PlansModule { }
