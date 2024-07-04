import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoinsRoutingModule } from './coins-routing.module';
import { CoinsComponent } from './coins.component';


@NgModule({
  declarations: [
    CoinsComponent
  ],
  imports: [
    CommonModule,
    CoinsRoutingModule
  ]
})
export class CoinsModule { }
