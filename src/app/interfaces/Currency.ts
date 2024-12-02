import { User } from "./User";

export interface Currency{
    currencyId: number;
    legend: string;
    symbol: string;
    ic: number;
    isDefault: boolean;
    userId: number;
    isFavorite?: boolean;
}
export interface FavoriteCurrency{
  favoriteCurrencyId: number;
  currencyId: number;
  currency: Currency;
  userId: number;
  user: User;
}