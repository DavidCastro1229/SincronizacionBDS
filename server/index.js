const express =require('express');
const cors=require('cors');
const rutas=require('./rutas');
const path= require("path");
const app =  express();
app.use(cors());
app.use(express.json());
app.use(rutas);
app.use(rutas);
const root = path.join(__dirname, '../client/build/index.html')
app.use(express.static(root));
console.log("ruta",root)
app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

app.listen(3012, ()=>console.log('server activo'));





