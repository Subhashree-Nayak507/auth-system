export interface User {
    username: string;
    password: string; 
    role: 'admin' | 'user';
}

export const users: User[] = [
    {
        username: "admin",
        password: "admin123", 
        role: "admin"
    },
    {
        username: "john",
        password: "user123", 
        role: "user"
    }
];
