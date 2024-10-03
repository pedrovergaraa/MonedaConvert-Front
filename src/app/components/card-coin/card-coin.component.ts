import { Component, Input } from '@angular/core';
import { Currency } from 'src/app/interfaces/Currency';

@Component({
  selector: 'app-card-coin',
  standalone: true,
  templateUrl: './card-coin.component.html',
  styleUrls: ['./card-coin.component.scss']
})
export class CardCoinComponent {
  @Input({required:false}) currency!:Currency;
}
