import { IsEmail, IsString, MinLength } from "class-validator";


export class RegisterUserDto {


    @IsEmail() // Digo que esta propiedad email debe lucir como correo electrónico, si no luce así, no lo acepto.
    email: string;

    @IsString() // Tiene que venir ese name como string, si no, no lo acepto
    name: string;

    @MinLength(6) // Si no viene con mínimo 6 caracteres no lo acepto
    password: string;

}