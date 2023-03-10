import express from 'express';
import { actualizarPerfil, autenticar, comprobarToken, confirmar, nuevoPassword, olvidePassword, perfil, registrar,actualizarPassword } from '../controllers/veterinarioControllers.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registrar)
//Rounting dinamico
//rutas publicas
router.get('/confirmar/:token', confirmar)
router.post('/login', autenticar)
router.post('/login', autenticar)
router.post('/olvide-password', olvidePassword)
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

// rutas privadas
router.get('/perfil', checkAuth, perfil)
router.put('/perfil/:id', checkAuth, actualizarPerfil)
router.put('/actualizar-password', checkAuth, actualizarPassword)
export default router;

