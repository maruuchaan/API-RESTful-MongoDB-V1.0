const usuarios = require('./routes/usuarios');
const servicios = require('./routes/servicios');
const auth = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
//const {MongoClient} = require('mongodb');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/usuarios', usuarios);
app.use('/api/servicios', servicios);
app.use('/api/auth', auth); 

//Conexión al servidor de Atlas de MongoDB
// const uri = "mongodb+srv://mcavieres:mcavieres@cluster0.mdghv.mongodb.net/api-node-test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
//   console.log("conectado");
// });

//Conexión a la BBDD local
mongoose.connect(config.get('configDB.HOST'),{useNewUrlParser: true, useUnifiedTopology: true}) //-> lo que está en paréntesis está en la doc de mongoose.com, demo es el nombre de la bbdd/ connect es una promesa, por eso tiene el .then y el .catch
    .then(() => console.log('Conectado a MongoDB...'))
    .catch(err => console.log('No se pudo conectar con MongoDB...', err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Api RESTful OK y ejecutándose...');
})