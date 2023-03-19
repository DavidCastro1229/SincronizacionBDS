const { Router }= require('express')
const rutas = Router();

const {Conectar, crearExtencion, Sincronizar, comparacion}=require('./controllers')

rutas.post('/conectarbd', Conectar );
rutas.post('/crearExtencion', crearExtencion );
rutas.post('/sincronizar', Sincronizar );
rutas.post('/comparacion', comparacion );

module.exports= rutas;