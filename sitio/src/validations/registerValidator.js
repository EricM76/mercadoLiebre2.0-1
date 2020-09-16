const {check,validatorResult,body} = require('express-validator');
const dbUsuarios = require('../data/dbUsuarios');

module.exports = [
    check('nombre')
    .isLength({
        min:1
    })
    .withMessage('Debes ingresar un nombre válido'),
    
    check('apellido')
    .isLength({
        min:1
    })
    .withMessage('Debes ingresar un apellido válido'),
    
    body('email')
    .custom(function(value){
        console.log(value)

        let usuario = dbUsuarios.filter(user=>{ //filtro la base de datos y asigno el resultado a una varaible
            return user.email == value //aplico la condición si coincide el mail que el usuario ingresó en el imput con que está registrado
        })
        if(usuario == false){ 
            return true 
        }else{
            return false 
        }
     
    })
    .withMessage('Este email ya está registrado'),

    /*check('email')
    .isEmail()
    .withMessage('Debes ingresar un email válido'),*/

    check('pass')
    .isLength({
        min:6,
        max:12
    })
    .withMessage('La contraseña debe tener entre 6 y 12 caracteres'),

    body('pass2')
    .custom(function(value,{req}){
        if(value != req.body.pass){
            return false
        }
        return true
    })
    .withMessage('Las contraseñas no coinciden')
]