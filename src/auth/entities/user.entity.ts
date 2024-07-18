import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class User { // Vamos a definir como queremos que luzcan nuestros usuarios para que mongo los guarde de esta forma, es decir, que luzcan de esta forma, es por eso que necesito crear un esquema, por eso le agregago a esta clase el decorador @Schema().

    _id?: string; // Por defecto mongodb le da el id a cada usuario

    @Prop({ unique: true, required: true }) // Porque quiero grabar cada una de estas propiedades en la base de datos, y le agrego la configuración de esta propiedad, es decir, que el email debe ser único y siempre debe ser obligatorio para crear el usuario.
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ minlength: 6, required: true })
    password?: string;

    @Prop({ default: true })
    isActive: boolean; // Va a verificar si el usuairo está activo o no, y le decimos que por defecto cuando cree los usuarios van a estar en true

    @Prop({ type: [String], default: ['user'] }) // Este determina los roles de cada usuario, hay unos que pueden ser user, admin, etc. Porque dependiendo del rol se les permite realizar ciertas acciones. Le digo que quiero que ese objeto se almacene como string en la base de datos
    roles: string[];

}

// Proporcionamos el esquema, osea que la base de datos pueda recibir este esquema
export const UserSchema = SchemaFactory.createForClass( User );
