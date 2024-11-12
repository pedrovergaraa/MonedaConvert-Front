import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConverterRoutingModule } from './converter-routing.module';
import { ConverterComponent } from './converter.component';

import { FormsModule } from '@angular/forms';
import { FavoriteCoinComponent } from 'src/app/components/favorite-coin/favorite-coin.component';


@NgModule({
  declarations: [
    ConverterComponent,
    FavoriteCoinComponent
  ],
  imports: [
    CommonModule,
    ConverterRoutingModule,
    FormsModule
  ]
})
export class ConverterModule {

 }
