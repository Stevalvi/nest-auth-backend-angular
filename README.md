
# Backend en Nest


#1 Levantar la base de datos, se ejecuta el siguiente comando en la terminal:
      docker compose up -d


#2 Copiar el .env.template y renombrarlo a .env

La idea de estas variables de entorno, es que sea fácil de cambiar y al dia de mañana cuando yo ya tengo mi backend, yo fácilmente puedo cambiar la base de datos simplemente cambiando esta cadena de conexión de la url de mi variable de entorno por la que yo voy a usar en la vida real, que sería la base de datos ya montada.