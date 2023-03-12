const express =require('express');
const cors=require('cors');
const rutas=require('./rutas');
const app =  express();
app.use(cors());
app.use(express.json());
app.use(rutas);


app.listen(process.env.PORT || 4000, ()=>console.log('server activo'));
