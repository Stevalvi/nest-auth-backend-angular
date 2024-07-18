import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt'; // Para generar esos token de autenticación
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs'; // Esto es para encriptar las contraseñas en la base de datos, para que sean difíciles de leer.

import { RegisterUserDto, CreateUserDto, UpdateAuthDto, LoginDto } from './dto';

import { User } from './entities/user.entity';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';


// Quiero que el auth.service haga todo el trabajo de crear usuarios, verificar el login, verificar el token, ejecutar contraseñas, etc.

@Injectable()
export class AuthService {

  // Inyección de dependencias para crear un registro de base de datos
  constructor(

    // Con este código ya puedo hacer todas las interacciones con la base de datos relacionada a todo lo que ya tengo definido en ese esquema
    @InjectModel( User.name ) // Esto simplemente es una propiedad que tiene un decorador y se llama userModel
    private userModel: Model<User>,
    private jwtService: JwtService,

  ) {}
  
 async create(createUserDto: CreateUserDto): Promise<User> {


    // Si quiero crear un usuario se hace de la sig. manera:
    

    // Si llega a haber un error lo atrapo aquí
    try {
      
      const { password, ...userData } = createUserDto; // Voy a desestructurar el password y todo lo demás (email, name) lo voy a añadir usando el operador rest en una variable llamada userData

      // 1- Encriptar la contraseña
      const newUser = new this.userModel({ // Creo una nueva instancia del userModel donde la contraseña va a ser igual a la contraseña encriptada, eso lo hará de manera sincrona, y ese número 10 es para que siempre cree un número diferente.
        password: bcryptjs.hashSync( password, 10 ), ...userData
      });

      // 2- Guardar el usuario
      
      await newUser.save(); // Vuelvo a mandar a llamar lo mismo de siempre.

      const { password:_, ...user } = newUser.toJSON(); // Estoy exluyendo la contraseña para mandarle el objeto al usuario de que ya fué creado el usuario pero sin enviarle lo de la contraseña, y ese _ es para renombrar ese password porque ya tengo una variable llamada así

      return user;
  
      
      // 3- Generar el Jason Web Token

      
    } catch (error) {
      if( error.code === 11000) { // Ese error de 11000 es cuándo ya existe ese usuario
        throw new BadRequestException(`${ createUserDto.email } already exists!`)
      }
      throw new InternalServerErrorException('Something terrible happen!!!'); // En caso de que sea otro error y no el 11000
    }

  }

  async register( registerDto: RegisterUserDto ): Promise<LoginResponse> {

    const user = await this.create( registerDto ); // Tenemos la creación de nuestro usuario

    return {
      user: user,
      token: this.getJwtToken({ id: user._id})
    }
  }


  async login( loginDto: LoginDto ): Promise<LoginResponse> { // El login debe regresar el usuario y el token de acceso.  Con esto ya tengo el correo electrónico y la contraseña del usuario. El login va a responder ese LoginResponse

    const { email, password } = loginDto; // Extraigo las propiedades que me interesa

    // Verificar si el usuario existe con ese correo electrónico
    const user  = await this.userModel.findOne({ email });

    if ( !user ) { // Si no existe ese usuario
      throw new UnauthorizedException('Not valid credentials - email');
    }

    if ( !bcryptjs.compareSync( password, user.password )) { // Si las contraseñas no son iguales, no permite iniciar sesión
      throw new UnauthorizedException('Not valid credentials - password');
    }

    const { password:_, ...rest  } = user.toJSON(); // Voy a tomar la desestructuración del password y el _ para que la renombre y no choque con mi otra variable llamada igual, y luego que traiga el resto de la información con ese ...rest

    return {
      user: rest, // El spread del usuario, le asignamos al user ese objeto rest, de esa forma lo vamos a tener agrupado
      token: this.getJwtToken({ id: user.id }), // Genero el token de acceso, y el payload va a tener el id del usuario
    }
  }


  findAll(): Promise<User[]> {
    return this.userModel.find(); // Regreso todos los usuarios
  }


  async findUserById( id: string ) { // En base al id obtenemos ese usuario completo 
    const user = await this.userModel.findById( id );
    const { password, ...rest } = user.toJSON();
    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayload) {
    const token = this.jwtService.sign( payload ) // Voy a mandar el payload
    return token; // Regreso el token

  }
}
