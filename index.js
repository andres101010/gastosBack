const express = require('express')

const app = express()

const mysql = require('mysql')

app.use(express.json())

const conexionBD = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'ventas'
})
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
  });

const  obtenerUsuario = () => {
    return {
        id : 1,
        nombre : 'Carlos',
        usuario : 'C2',
        estado : true
    }
}

app.use((req, res, next) => {
    const usuarioPermitido = obtenerUsuario() 
    req.locals = {
        usuarioPermitido
    }
    next()
})

const middlwareAgregarUsuario = (req, res, next) => {
    console.log(' Se ejecuto el middlwareAgregarUsuario')
    const usuarioPermitido = obtenerUsuario() 
    //middleware para agregar usuario
    if (usuarioPermitido.usuario === "Cd" ){
        req.locals = {
            usuarioPermitido,
        }
        next()
    } else {
        req.locals = 'Usuario sin permisos'
        console.log('Usuario no permitido')
        next()
    }
}


app.get('/', (req,res) => {
    res.send('Bienvenidos al inicio')
})

app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * from usuarios'

    conexionBD.query(sql, (error, results) =>{
        if(error) throw error
        if(results.length > 0) {
            res.json(results)
        }else{
            res.send('no hay datos disonible')
        }
    })
   // res.send('Esta es la lista de usuarios')
})

app.get('/usuario/:usuarioId', (req, res) => {
    console.log('Parametro', req.params)
    const id = req.params
    const sql = `SELECT * FROM usuarios WHERE idusuarios = ${id.usuarioId}`
    //console.log('id', id)
    conexionBD.query(sql, (error, results) => {
        if(error) throw error
        if(results.length > 0){
            res.json(results)
        }else{
            res.send('usuario no encontrtado')
        }
    })

})

app.post('/agregar-usuario', (req,res) => {
    const sql = 'INSERT INTO usuarios SET ?'

    const usuarioObj = {
        idusuarios : req.body.idusuarios,
        nombre : req.body.nombre,
        usuario : req.body.usuario,
    };
    conexionBD.query(sql, usuarioObj, error => {
        if(error) throw error
    })
    res.send('Usuario creado con exito')
})

app.put('/actualizar-usuario/:usuarioId',(req, res) => {
    const id = req.params;
    const {nombre,usuario} = req.body;
    const sql = `UPDATE usuarios SET nombre = '${nombre}', usuario = '${usuario}' where idusuarios = ${id.usuarioId}`
    conexionBD.query(sql, error => {
        if (error) throw error
    })
    res.send(`El usuario con el Id ${req.params.usuarioId} fue actualizado con exito.`)
})

app.delete('/eliminar-usuario/:usuarioId', (req, res) => {
    const id = req.params
    const sql = `DELETE FROM usuarios where idusuarios = ${id.usuarioId}`
    conexionBD.query(sql,error => {
        if(error) throw error
    })
    res.send(`EL usuario con el Id ${req.params.usuarioId} fue eliminado con exito.`)
})

app.listen(3001, () => {
    console.log('Servidor en el puerto 3001')
})


// CRUD

// c =  CREATE
// R = READ
// U = UPDATE
// D = DELETE 