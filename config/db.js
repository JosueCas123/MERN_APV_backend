import mongoose from 'mongoose';

// conectar a a la base de datos de mongoDb
const conectarDB = async () => {
    // try catch para ver si hay un error
    try {

        // hacemos una connexion a la base de datos, le enviamos un objeto de configuracion
        const db = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
        })

        // nos creara un url y un puerto
        const url = `${db.connection.host}:${db.connection.port}`
        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log(`error: ${error.message}`)
        process.exit(1);
    }
}

export default conectarDB;