import express from 'express';
import router from "./routes/index.js"
import db from "./config/db.js"

import dotenv from "dotenv"
dotenv.config({ path: 'variables.env' })


const app = express();

// Conectar a la base de datos //
db.authenticate()
    .then( () => console.log("Base de datos conectada") )
    .catch( error => console.log(error) );


// Habilitar pug //
app.set("view engine", "pug");

// Obtener el año actual //  // Cada una de estos métodos en este archivo (index.pug), son middlewares. A diferencia del resto, si éste no lo creo la aplicación funciona bien igual, sólo que en el footer tendría que hardcodear el año. Por lo tanto, de esta forma obtengo el año actual en el que se hace la petición a través de este middleware y ya nunca tendría que hardcodear el año actual a medida que pasen los años. // 
app.use( (req, res, next) => {
    const year = new Date();
    res.locals.anioActual = year.getFullYear();

    res.locals.nombreSitio = "Agencia de viajes";

    return next();  // El return está demás pero a veces el next queda trabado y de esta forma no se traba. //
} )

// Agregar body parser para leer los datos del formulario //
app.use(express.urlencoded({extended: true}));  // Esta línea sirve para poder acceder al objeto "body" que está dentro del objeto "req" en los controladores //

// Definir la carpeta pública //
app.use(express.static("public"));
app.use('/viajes', express.static('public'));   // Esta línea es indispensable para poder acceder a los recursos de la carpeta 'public' desde direcciones donde el primer nivel sea 'viajes' y el segundo sea cualquier cosa. O sea, si no agrego esta línea, las vistas de routes 'localhost:4000/viajes/cualquierCosa' no van a ´poder ser renderizadas con las imágenes y los estilos.

// Agregar router //
app.use("/", router);


const host = process.env.HOST || '0.0.0.0'; // Si la variable process.env.HOST no existe (ésto se da en el entorno de desarrollo que en este caso va a ser HEROKU), se carga el '0.0.0.0' y, al cargarse este valor, HEROKU sabe que el valor que tiene que poner en esta variable no es '0.0.0.0' sino un valor de host que el propio HEROKU lo asignará automáticamente. //
const port = process.env.PORT || 4000;
app.listen(port, host, () => console.log(`El servidor está funcionando en el puerto ${port}`) );    // El mensaje que se muestra en la callback se escribe en la consola sólo en caso de que la conexión a ese host en ese puerto, haya sido exitosa. //