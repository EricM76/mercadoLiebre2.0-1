let dbProductos = require('../data/database');
let dbUsuarios = require('../data/dbUsuarios');

const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

module.exports = {
    register:function(req,res){
        res.render('userRegister',{
            title:"Registro de Usuario",
            css: "index.css"
        })
    },
    processRegister:function(req,res){
       let errors = validationResult(req);
       let lastID = 0;
       if(dbUsuarios.length > 0){
        dbUsuarios.forEach(user=>{
            if(user.id > lastID){
                lastID = user.id
            }
        })
       }
       
       if(errors.isEmpty()){
           let nuevoUsuario = {
               id:lastID +1,
               nombre: req.body.nombre,
               apellido: req.body.apellido,
               email: req.body.email,
               avatar: req.files[0].filename,
               pass:bcrypt.hashSync(req.body.pass,10),
               rol:"user"
           };
           dbUsuarios.push(nuevoUsuario);
           fs.writeFileSync(path.join(__dirname,'..','data','dbUsuarios.json'),JSON.stringify(dbUsuarios),'utf-8');
           return res.redirect('/users/login');
       }else{
           res.render('userRegister',{
            title:"Registro de Usuario",
            css: "index.css",
            errors:errors.mapped(),
            old:req.body
           })
       }
    },
    login:function(req,res){
        res.render('userLogin',{
            title:"Ingresá a tu cuenta",
            css: "index.css",
            usuario:req.session.usuario
        })
    },
    processLogin:function(req,res){
        let errors = validationResult(req);
        if(errors.isEmpty()){
            dbUsuarios.forEach(usuario => {
                if(usuario.email == req.body.email){
                    req.session.usuario = {
                        id:usuario.id,
                        nick:usuario.nombre + " " + usuario.apellido,
                        email:usuario.email,
                        avatar:usuario.avatar
                    }
                }
            });
            if(req.body.recordar){
                res.cookie('userMercadoLiebre',req.session.usuario,{maxAge:1000*60*2})
            }
            res.redirect('/')
        }else{
            res.render('userLogin',{
                title:"Ingresá a tu cuenta",
                css: "index.css",
                errors:errors.mapped(),
                old:req.body,
                usuario:req.session.usuario
               })
        }
    },
    profile:function(req,res){
        res.render('userProfile',{
            title: "Perfil de usuario",
            productos:dbProductos.filter(producto=>{
                return producto.category != "visited" && producto.category != "in-sale"
            }),
            css:"profile.css",
            usuario:req.session.usuario

        })
    },
    logout:function(req,res){
        req.session.destroy();
        if(req.cookies.userMercadoLiebre){
            res.cookie('userMercadoLiebre','',{maxAge:-1})
        }
        return res.redirect('/')
    }
}