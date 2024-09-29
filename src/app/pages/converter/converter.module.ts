import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConverterRoutingModule } from './converter-routing.module';
import { ConverterComponent } from './converter.component';
import { FavoriteCoinComponent } from 'src/app/components/favorite-coin/favorite-coin.component';


@NgModule({
  declarations: [
    ConverterComponent,
    FavoriteCoinComponent
  ],
  imports: [
    CommonModule,
    ConverterRoutingModule
  ]
})
export class ConverterModule {

 }
