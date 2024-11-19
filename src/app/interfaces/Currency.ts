import { User } from "./User";

export interface Currency{
    currencyId: number;
    legend: string;
    symbol: string;
    ic: number;
    isDefault: boolean;
    userId: number;
}
export interface FavoriteCurrency{
  favoriteCurrencyId: number;
  currencyId: number;
  currency: Currency;
  userId: number;
  user: User;
}