const mongoose = require('mongoose'); //libreria para el manejo a la conexion de bases de datos
const User = require("../models/users"); //modelo usuarios.
const AuthController = {}; // objeto que tendra la logica de nuestra web
const bcrypt = require('bcrypt'); //libreria para encriptar

AuthController.login = function (req, res, next) {
    res.render('signin'); //
}
AuthController.create = function (req, res, next) {
    res.render('signup')
}
AuthController.store = async function (req, res) {
    //obteniendo los datos del usuario
    let user = {
        name: req.body.name,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    /*alamcenando el usuario*/
    await User.create(user, (error, user) => {
        if (error) // si se produce algun error
            //Devolvemos una vista con los mensajes de error
            return res.render('signup', { err: 'Alguno de los campos esta vacio o el correo esta en uso', email: user.email });
        else {
            //Almacenamos los datos de la consulta en el objeto data
            let data = {
                userId: user._id.toString(),
                name: user.name,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                password: user.password
            }
            //hash es el mé que nos permite encriptar el password
            //con 10 le indicamos cuantas veces realizara la encriptación
            bcrypt.hash(data.userId, 10, function (err, hash) {
                if (err) { //si produce un error
                    next(err); // retornaremos el error
                }

                data.userId = hash; // almacenamos la password encriptada
                //parseamos el objeto json a cadena y lo alamcenamos en la variable session
                req.session.user = JSON.stringify(data);
                console.log(req.session.user);
                //nos dirigira a la pagina donde se encuentra el perfil del usuario
                //window.sessionStorage.currentUser = data.userId
                return res.redirect('/users/home');
            });
        }
    })

};


AuthController.profile = function (req, res) {
    return res.render('profile');
}
AuthController.home = function (req, res) {
    return res.render('home');
}

AuthController.signin = function (req, res, next) {
    var data = {};
    //user autentication es el metodo que nos permitira ingresar al sistema
    User.authenticate(req.body.email, req.body.password, (error, user) => {
        if (error || !user) {
            res.render('signin', { err: error, email: req.body.email });
            //return res.send("Ddd");
        }
        else {
            data.userId = user._id.toString(),
                data.name = user.name,
                data.lastName = user.lastName,
                data.username = user.username,
                data.email = user.email,
                data.password = user.password

            //este método nos encriptara el userId para que sea alamcenado en la sesion
            bcrypt.hash(data.userId, 10, function (err, hash) {
                if (err) {
                    next(err);
                }
                data.userId = hash;
                //parseamos el objeto a cadena
                req.session.user = JSON.stringify(data);
                //si es correcto nos dirigira al perfil del usuario que esta ingresando.
                return res.redirect('/users/home');
            });

        }
    });
};

AuthController.logout = function (req, res, next) {
    if (req.session) { //si la session existe
        req.session.destroy(function (err) { // destruimos la sesion
            if (err) { // si produce un error
                next(err);
            }
            else { //si la sesion se destruyo nos dirigira al index
                res.redirect('/');
            }
        });
    }
}

//modificar usuario
AuthController.update = async function (req, res) {

    var user = {
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password

    };

    bcrypt.hash(user.password, 10, function (err, hash) {

        if (err) {
            return next(err);
        }
        else {
            console.log(hash);
            user.password = hash;

            User.findOneAndUpdate({ username: req.body.username }, user, function (err, old) {
                if (err) {
                    res.status(500);
                    res.json({
                        ok: false,
                        err
                    })
                } else {
                    res.json({
                        ok: true,
                        old,
                        user
                    });
                }
            });
        }
    })

    console.log('hello ', user.password);




}

module.exports = AuthController;