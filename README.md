# TEST DE CONOCIMIENTO

API Rest para manejo de usuarios realizada en NodeJS con Express y MongoDB.

- Metodo GET
  Develve todos los usarios especificados segun los query offset y limits siguiendo los parametros:

```javascript
id: Mixed;
name: String;
last_name: String;
age: Number;
```

- Metodo GET por id
  Devuelve un usuario segun el id siguiendo los parametros:

```javascript
id: Mixed;
name: String;
last_name: String;
age: Number;
```

- Metodo POST
  Crea un usuario segun los siguientes requerimientos en el cuerpo de la peticion:

```javascript
name: String, required;
last_name: String, required;
legajo: String, required, unique;
email: String, required;
birthday: Date, required;
```

- Metodo PUT
  Actualiza un usuario en los siguientes valores enviados en el cuerpo de la peticion:

```javascript
name: String;
last_name: String;
birthday: Date;
```

- Metodo DELETE
  Elimina un usuario segun el id enviado

Documentacion de POSTMAN:
<https://documenter.getpostman.com/view/15757331/TzzANHFG>
