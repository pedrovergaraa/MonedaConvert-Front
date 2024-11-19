import { Currency, FavoriteCurrency } from "./Currency";
import { Subscription } from "./Subscription";

export interface RegisterData extends User {
    password: string,
    confirmPassword: string;
}

export interface User{
    userId: number;
    email: string;
    password: string;
    attempts: number;
    subscriptionId: number;
    subscription: Subscription;
    currencies: Currency[];
    favoriteCurrencies: FavoriteCurrency[];
}

export interface LoginData {
    email: string,
    password: string
}

export interface SubscriptionData {
	newSubscriptionId: number;
}