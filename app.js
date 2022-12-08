const express = require('express')

const app = express()

const {mesas} = require('./mesas/mesas.js')


let cors = require("cors"); //Importar cors para consumir mi api
app.use(cors()); //Usar cors
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())  

/////////////////Mesas

app.get('/mesas',(req,res) =>{
    respuesta = mesas
    if (req.query.pendiente == "true"){  
        respuesta = mesas.filter(m => m.pedidoPendiente == true)
    }
    res.send(JSON.stringify(respuesta))
})

app.get('/mesas/:id',(req,res) =>{
    const id = req.params.id
    res.send(JSON.stringify(mesas[id-1]))
})

// app.delete('/mesas/:id',(req,res) =>{
//     const id = req.params.id
//     let mesaAVaciar = mesas[id-1]
//     mesaAVaciar.productos = []
//     mesaAVaciar.pedidoPendiente = false
//     res.send(JSON.stringify(mesas[id-1]))
// })

////////////////////Pedidos////////////////////
app.get('/mesas/:id/pedido',(req,res) =>{
    const id = req.params.id
    res.send(JSON.stringify(mesas[id-1].productos))
})

app.post('/mesas/:id/pedido',(req,res) =>{
    try {
        const id = req.params.id
        let pedidoCompleto = req.body
        let mesaPedido = mesas[id-1]
        if(typeof(pedidoCompleto[0].precio) === typeof(27)){//typeof(pedidoCompleto[0].precio) == number
        mesaPedido.productos = mesaPedido.productos.concat(pedidoCompleto) //Concatena pedidos en caso de que ya haya
        mesaPedido.pedidoPendiente = true
        res.send(JSON.stringify(mesas[id-1]))
        }      
    }catch(error) {
        res.status(400)
        console.log("El formato del pedido es incorrecto")
        res.send('[{"nombre": "STRING","cantidad": INTEGER,"precio": INTEGER}]')
    }
    
})

app.delete('/mesas/:id/pedido',(req,res) =>{
    const id = req.params.id
    let mesaAVaciar = mesas[id-1]
    mesaAVaciar.productos = []
    mesaAVaciar.pedidoPendiente = false
    res.send(JSON.stringify(mesas[id-1]))
})

app.patch('/mesas/:id',(req,res) =>{
    let parche = req.body
    let id = req.params.id
    mesas[id-1].pedidoPendiente = parche.pedidoPendiente
    res.send(JSON.stringify(mesas[id-1].pedidoPendiente))
})

// app.patch('/mesas/:id/pedido/pendiente',(req,res) =>{
    
// })

//////////////Deploy

const puerto = process.env.PORT || 3000; //Usar puerto de entorno si hay, o 3000

let dominio = process.env.DOMAIN || "http://localhost:3000"

console.log("El dominio es: " + dominio )
app.listen(puerto, () => {
    console.log('Servidor JBNM escuchando en el puerto ' + puerto)
})

//This is a QA Deploy
