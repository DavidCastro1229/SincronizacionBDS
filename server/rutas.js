const { Router }= require('express')
const rutas = Router();

const {Conectar, crearExtencion, Sincronizar}=require('./controllers')

rutas.post('/conectarbd', Conectar );
rutas.post('/crearExtencion', crearExtencion );
rutas.post('/sincronizar', Sincronizar );

module.exports= rutas;