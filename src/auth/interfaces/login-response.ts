import { User } from "../entities/user.entity";


export interface LoginResponse {
    // Va a tener la información que quiero regresar

    user: User;
    token: string;

}