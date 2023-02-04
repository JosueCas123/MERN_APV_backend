import Veterinario from "../models/Veterinario.js"
import generarJWT from "../helpers/generarJWT.js"
import generarId from "../helpers/generarId.js"
import {emailRegistro} from '../helpers/emailRegistro.js'
import { emailOlvidePassword } from "../helpers/emailOlvidePassword.js"


const registrar =async (req, res) => {

    const {email, nombre} = req.body

    //prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email})

    if (existeUsuario) {
        const error = new Error('Usuario ya regsitrado')
        return res.status(404).json({msg: error.message})
    }

    try {

        //guardar veterinario
        const veterinario = new Veterinario(req.body)
        const veterinarioGuardado = await veterinario.save();

        //Enviar email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token,
        })

        res.json(veterinarioGuardado)
    } catch (error) {
        console.log(error)
    }
    

}
const perfil = (req, res) => {
    
    const {veterinario} = req;
     res.json(veterinario)
}


const confirmar = async(req, res) => {

    const {token} = req.params

    const usuarioConfimar = await Veterinario.findOne({token})
    
    if (!usuarioConfimar) {
        const error = new Error('token no valido')
        return res.status(404).json({msg: error.message})
    }

    try {
        usuarioConfimar.token = null,
        usuarioConfimar.confirmado = true,

        await usuarioConfimar.save()
        res.json({msg: "Usuario confirmado"})
    } catch (error) {
        console.log(error)
    }

}

const autenticar =async (req, res) => {
    const {email, password} = req.body;

    const usuario = await Veterinario.findOne({email})

    if (!usuario) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message})
    }

    //verificar si el usuario esta confirmado

    if (!usuario.confirmado) {
        const error = new Error('Usuario no confirmado')
        return res.status(404).json({msg: error.message})
    }

    if (await usuario.comprobarPassword(password)) {
        
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token:  generarJWT(usuario.id)
        })
    }else{
        const error = new Error('Password Incorrecto')
        return res.status(403).json({msg: error.message})
    }
    
}

const olvidePassword =async (req, res) => {
    const {email} = req.body;

    const existeVeterinario = await Veterinario.findOne({email})

    if (!existeVeterinario) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({msg: error.message})
    }
    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        //enviar email
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token

        })
        res.json({msg: 'emos enviado a tu email las instcciones'})
    } catch (error) {
        console.log(error)
    }
}
const comprobarToken = async(req, res) => {
    const {token} = req.params

    const tokenValido = await Veterinario.findOne({token});
    if (tokenValido) {
        res.json({msg: 'El token es valido'})
    }else{
        res.status(400).json({msg: 'El token no existe'})

    }
}
const nuevoPassword = async(req, res) => {
    const {token} = req.params
    const {password} = req.body
    const veterinario = await Veterinario.findOne({token});
    if (!veterinario) {
        const error = new Error('Hubo un error')
        return res.status(400).json({msg: error.message})
    }
    
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg:'Password modificado correctamente'})


    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async(req, res )=> {
    const veterinario = await Veterinario.findById(req.params.id)
    if (!veterinario) {
        const error = new Error("Hubi un error")
        return res.status(400).json({msg: error.message})
    }

    const {email} = req.body

    if(veterinario.email !== req.body){
        const exisyeEmail = await Veterinario.findOne({email})
        const error = new Error("El email ya fue registado")
        return res.status(400).json({msg: error.message})
    }
    
    try {
        veterinario.nombre = req.body.nombre;
        veterinario.emaill = req.body.email; 
        veterinario.web = req.body.web; 
        veterinario.telefono = req.body.telefono; 

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error)
    }

}

const actualizarPassword = async(req, res)=> {
    //leer datos
    const {id} = req.veterinario
    const {pwd_actual, pwd_nuevo} = req.body
     //comprovar que el veterinario exista
     const veterinario = await Veterinario.findById(id)
    if (!veterinario) {
        const error = new Error("Hubi un error")
        return res.status(400).json({msg: error.message})
    }

    //comprobar su password

    if(await veterinario.comprobarPassword(pwd_actual)){
        //almacenar en la base de datos
        veterinario.password = pwd_nuevo;
        await veterinario.save()
        res.json({msg: 'Password almacenado correctamente'})
    }else{
        const error = new Error("El pwd_actual es incorrto")
        return res.status(400).json({msg: error.message})
    }

    console.log(req.veterinario)
    console.log(req.body)
}
export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}