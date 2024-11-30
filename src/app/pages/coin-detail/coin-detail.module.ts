import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoinDetailRoutingModule } from './coin-detail-routing.module';
import { CoinDetailComponent } from './coin-detail.component';

import { CardCoinComponent } from "../../components/card-coin/card-coin.component";
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CoinDetailComponent
  ],
  imports: [
    CommonModule,
    CoinDetailRoutingModule,
    CardCoinComponent,
    FormsModule
]
})
export class CoinDetailModule { }
