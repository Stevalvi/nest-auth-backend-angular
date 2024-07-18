
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { CreateUserDto, LoginDto, RegisterUserDto, UpdateAuthDto,  } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login-response';
import { User } from './entities/user.entity';

@Controller('auth') // Este es el url
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Ya tenemos todo el CRUD montado 

  @Post() // Este método de Post toma el body y hace que luzca como createUserDto, osea que para crear un usuario, debe cumplir con lo establecido en el CreateUserDto, si no, no se acepta.
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }


  // Creo el endpoint de login
  @Post('/login')
  login(@Body() loginDto: LoginDto ) { // Necesito recibir el body
    return this.authService.login( loginDto ) // Mando a llamar el this.authService.login y le mando el loginDto
  }

  @Post('/register')
  register(@Body() registerDto: RegisterUserDto ) { 
    return this.authService.register( registerDto ) 
  }

  @UseGuards( AuthGuard) // Mando a llamar ese guard que estoy usando para la protección de rutas
  @Get()
  findAll( @Request() req: Request ) { // Con ese Request pretendemos obtener o reconstruir el usuario una vez se ha validado el token
    // const user = req['user']; // Eso nos trae el id del usuario

    // return user; // Eso nos trae el id del usuario
    return this.authService.findAll(); // Regresa todos los usuarios
  }

  // Generar un nuevo JWT, para asegurarnos de que la persona es quien dice ser, y cuando estemos en Angular y queramos movernos a otra ruta, podemos verificar de que cuando quiera entrar a esa ruta y esa ruta necesita autorización, vamos a verificar que el token todavía funcione.

  // LoginResponse
  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken( @Request() req: Request): LoginResponse {

    const user = req['user'] as User;

    return { // Return de lo que estoy esperando
      user,
      token: this.authService.getJwtToken({ id: user._id })
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
