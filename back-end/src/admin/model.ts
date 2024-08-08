export type Admin = {
    id: number;
    email: string;
    password: string;
    tokens: string[];
};

export type AdminCollection = Admin[];
