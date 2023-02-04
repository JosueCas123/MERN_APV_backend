import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacientesRoutes from './routes/pacientesRoutes.js'


const app = express();

//para que lea los datos de tipo json
app.use(express.json())

//Mandamos a llamar dotenv anter de llamar conectarDB
dotenv.config();

//sintaxix de nodejs para leer variables de entorno
// console.log(process.env.MONGO_URI)

//Mandar a llamar la conexion a la base de dato
conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = {
    origin: function(origin, callback){
        if (dominiosPermitidos.indexOf(origin) !== -1 ) {
            callback(null, true)
        }else{
            callback(new Error('No permitido por cors'))
        }
    }
}

app.use(cors(corsOptions))

app.use("/api/veterinarios", veterinarioRoutes) 
app.use("/api/pacientes", pacientesRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor Funcionando en el: ${PORT}`)
})
