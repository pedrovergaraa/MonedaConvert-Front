import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoinsRoutingModule } from './coins-routing.module';
import { CoinsComponent } from './coins.component';
import { CardCoinComponent } from 'src/app/components/card-coin/card-coin.component';
import { CreatCoinComponent } from 'src/app/components/create-coin/creat-coin.component';



@NgModule({
  declarations: [
    CoinsComponent
  ],
  imports: [
    CommonModule,
    CoinsRoutingModule,
    CardCoinComponent,
    CreatCoinComponent
  ]
})
export class CoinsModule { }
