export interface RegisterData extends User {
    password: string,
    confirmPassword: string;
}

export interface User{
    name: string,
    email: string,
    password: string
}

export interface LoginData {
    email: string,
    password: string
}