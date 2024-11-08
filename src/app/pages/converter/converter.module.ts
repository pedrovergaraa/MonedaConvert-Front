import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConverterRoutingModule } from './converter-routing.module';
import { ConverterComponent } from './converter.component';

import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ConverterComponent,
  ],
  imports: [
    CommonModule,
    ConverterRoutingModule,
    FormsModule
  ]
})
export class ConverterModule {

 }
