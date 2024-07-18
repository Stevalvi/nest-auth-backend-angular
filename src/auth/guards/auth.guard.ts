import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

// Proteger rutas con autenticación.


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}


  async canActivate(
    context: ExecutionContext,): Promise<boolean> {
    
      const request = context.switchToHttp().getRequest(); // Tengo toda la información referente a la solicitud, el url de donde viene, etc.
      const token = this.extractTokenFromHeader(request); // Extraigo el token, todavía no se está validando, por ahora solo lo voy a extraer.

      if( !token) { // Si no hay ningún token
        throw new UnauthorizedException();
      }

      try {
        const payload = await this.jwtService.verifyAsync<JwtPayload>( // Este payload debe lucir como un JwtPayload
          token,
          { secret: process.env.JWT_SEED } // Agregamos la variable de entorno 
        );

        const user = await this.authService.findUserById( payload.id ); // Hago primero la consulta del usuario antes de verificar si existe o no
        if ( !user ) throw new UnauthorizedException('User does not exists'); // Si no existe el usuario.
        if ( !user.isActive ) throw new UnauthorizedException('User is not active'); // Si no ha sido activado el usuario.

          // Estamos asignando la carga útil al objeto de solicitud aquí
          // para que podamos acceder a él en nuestros controladores de ruta
          request['user'] = user; // Si todo sale bien, voy a colocar ese usuario en la request

      } catch (error) { // En caso de que salga error, de que no haya podido verificar ese token
        throw new UnauthorizedException();
      }

    return true; // Si se pudo verificar el token, en este punto ya podemos retornar un true
  }

  // Este código al igual que el de arriba, se sacó de la guia de nest para el uso de los token, para validarlos.
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split('') ?? [];
    return type === 'Bearer' ? token : undefined; // Si viene la palabra Bearer regresa el token, y si no, no regresa nada
  }
}
