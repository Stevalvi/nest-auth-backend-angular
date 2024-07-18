import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Esto permite realizar las peticiones http de diferentes dominios, es algo que toca configurar si o si desde el backend. Se habilita para permitir que el usuario pueda registrarse, ingresar, etc..

  // Esta información lsa copié de la hoja de atajos de nest, básicamente dice vamos a bloquear cualquier información, vamos a ser super restringido nuestro backend, tiene que mandarme la información como yo espero, si no, no se la acepto y la rechazo.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )

  await app.listen( process.env.PORT || 3000); // Esto quiere decir, si el puerto está ortogado, usa ese puerte, pero si no lo está, que use el puerto 3000
}
bootstrap();
