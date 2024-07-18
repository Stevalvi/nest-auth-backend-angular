import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot(), // Para que mis variables de entorno estén listas

    MongooseModule.forFeature([
      { // Defino todos los modelos que voy a exponer directamente al módulo
        name: User.name,
        schema: UserSchema
      }
    ]),

    // El último paso para generar el Jason Web token de autenticación
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '6h' }, // Quiero que ese token expire cada 6 horas
    }),
  ]
})
export class AuthModule {}
