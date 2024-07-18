import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Para conectarnos a esa base de datos de MongoDB que cree
import { ConfigModule } from '@nestjs/config'; // Para configurar las variables de entorno


import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot(), // Con esto ya tengo acceso a mis variables de entorno

    MongooseModule.forRoot( process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
    } ), // La url que necesitamos para conectarnos a nuestra base de datos mongodb
    
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
