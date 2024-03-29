var express = require('express');
var router = express.Router();
//Requerimos el controlador que hemos creado
const AuthController = require("../controllers/UserController");
//Requerimos el Middelware que hemos creado
const AuthMiddleware = require("../middlewares/AuthMiddleware")
//Requerimos el modelo
const User = require("../models/users");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/signup', AuthController.create);
//ruta que enviara los datos del usuario para almacenarlos en la base de datos
router.post('/signup', AuthController.store);
//ruta que nos devolvera el formulario para ingresar
router.get('/signin', AuthController.login);
//ruta que enviara los datos del usuario para ingresar al sistema
router.post('/signin', AuthController.signin);
//ruta para salir del sistema
router.get('/logout', AuthController.logout);
/*Middlewar que verifica que solo los usuarios registrados podran ingresar a esta seccion */
router.use(AuthMiddleware.isAuthentication);
//ruta para acceder al perifl
router.get('/profile', AuthController.profile);
router.get('/home',AuthController.home);


module.exports = router;