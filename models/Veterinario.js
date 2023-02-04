import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import generarId from '../helpers/generarId.js';

//crear la estructura o shema
const verterinariosSchema = mongoose.Schema({
    nombre:{
        type: String,
        require: true,
        trim: true,
    },
    password:{
        type: String,
        require: true,
        unique: true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    telefono:{
        type:String,
        default: null,
        trim:true,
    },
    web:{
        type:String,
        default: null,
    },
    token:{
        type: String,
        default: generarId(),
    },
    confirmado:{
        type: Boolean,
        default: false
    }


});
verterinariosSchema.pre("save", async function(next){
    //para que el password no se vuelva a hashear
    if (!this.isModified("password")) {
        next();
    }

    // crea el hasheo del password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

verterinariosSchema.methods.comprobarPassword  = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
}

//registrar en mongoose
const Veterinario = mongoose.model("Veterinario", verterinariosSchema)
export default Veterinario;