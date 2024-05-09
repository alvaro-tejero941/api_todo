require("dotenv").config();
const express = require("express");
const {tareas,crearTarea, borrarTarea,editarTexto,toggleEstado} = require("./db");
const {json} = require("body-parser");
const cors = require("cors");

const servidor = express();

servidor.use(cors());
servidor.use(json());

if(process.env.LOCAL){
    servidor.use(express.static("./pruebas"));
}

servidor.get("/tareas", async (peticion,respuesta)=>{
    try{
        let resultado = await tareas();

        respuesta.json(resultado);

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.post("/tareas/nueva", async (peticion,respuesta,siguente) =>{
    if(!peticion.body.tarea || peticion.body.tarea.trim() == ""){
        return siguente(true);
    }

    try{
        let id = await crearTarea(peticion.body.tarea);
        respuesta.json({id});
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.put("/tareas/actualizar/:id([0-9]+)/:operacion(1|2)", async (peticion,respuesta,siguente) =>{
    let operacion = Number(peticion.params.operacion);
    let funciones= [editarTexto,toggleEstado];

    if(operacion == 1 && (!peticion.body.tarea || peticion.body.tarea.trim() == "")){
        return siguente(true);
    }
    try{
        let count = await funciones[operacion -1](peticion.params.id,operacion == 1 ? peticion.body.tarea : null);

        respuesta.status(200);
        respuesta.json({resultado : count ? "ok" : "ko"});
    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
})

servidor.delete("/tareas/borrar/:id([0-9]+)", async (peticion,respuesta) => {
    //respuesta.send(`borraremos la tarea  con el ID: ${peticion.params.id}`);
    try{
        let count = await borrarTarea(peticion.params.id);

        respuesta.status(200);
        respuesta.json({resultado : count ? "ok" : "ko"});

    }catch(error){
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.use((peticion,respuesta) =>{
    respuesta.status(404);
    respuesta.json({error : "recurso no encontrado"});
})

servidor.use((error,peticion,respuesta,siguente) =>{
    respuesta.status(400);
    respuesta.json({error : "error en la peticion"});
})


servidor.listen(process.env.PORT);