

// Básicamente esta es la información por la cuál queremos autenticar que usuario es con ese token de autenticación y permitir al usuario iniciar sesión. Es decir vamos a reconstruir ese usuario con esta información, con el id ya es suficiente para saber que usuario es, vamos a tener la fecha de creación y la fecha de expiración 

export interface JwtPayload {

    id: string;
    iat?: number;
    exp?: number;
}