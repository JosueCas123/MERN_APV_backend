import {Paciente} from '../models/Pacientes.js'

const agregarPaciente =async (req,res) => {

    const paciente = new Paciente(req.body)
    paciente.veterinario = req.veterinario._id


    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado)
    } catch (error) {
        console.log(error)
    }
    
}


const obteberPacientes = async(req,res) => {
    const paciente = await Paciente.find()
        .where("veterinario")
        .equals(req.veterinario);

    res.json(paciente)
}   

const optenerPaciente = async(req, res) => {
    const {id} = req.params
    const paciente = await Paciente.findById(id)

    if(!paciente){
        return res.status(404).json({msg:'No encontrado'})
    }


    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Accion no valida'})
    }

    res.json(paciente)
    
}
const autualizaPaciente = async(req, res) => {
    const {id} = req.params
    const paciente = await Paciente.findById(id)

    if(!paciente){
        return res.status(404).json({msg:'No encontrado'})
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Accion no valida'})
    }

    //Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre
    paciente.propietario = req.body.propietario || paciente.propietario
    paciente.email = req.body.email || paciente.email
    paciente.fecha = req.body.fecha || paciente.fecha
    paciente.sintomas = req.body.sintomas || paciente.sintomas
 
    try {
       const pacienteActualizado = await paciente.save();
       res.json(pacienteActualizado)
    } catch (error) {
       console.log(error)
    }
    
}
const eliminarPaciente = async(req, res) => {
    const {id} = req.params;
    const paciente = await Paciente.findById(id);
     //console.log(paciente)

     if (!paciente) {
       return  res.status(404).json({msg: 'No encontrado'})
     }
     if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Accion no valida'})
     }

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente eliminado'})
    } catch (error) {
        console.log(error)
    }
}

export {
    agregarPaciente,
    obteberPacientes,
    optenerPaciente,
    autualizaPaciente,
    eliminarPaciente
}