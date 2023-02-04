import express from 'express';
import { agregarPaciente, obteberPacientes, optenerPaciente, eliminarPaciente, autualizaPaciente } from '../controllers/pacienteControllers.js';
import checkAuth from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', checkAuth, agregarPaciente)
router.get('/', checkAuth, obteberPacientes)

router.route("/:id")
    .get(checkAuth, optenerPaciente)
    .put(checkAuth, autualizaPaciente)
    .delete(checkAuth, eliminarPaciente)

export default router;