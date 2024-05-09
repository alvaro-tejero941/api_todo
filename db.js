require("dotenv").config();
const postgres = require("postgres");

function conectar(){
    
    return postgres({
        host :process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
    });
}

function tareas(){
    return new Promise( async (ok,ko) => {
        try{
            const conexion = conectar();

            let tareas = await conexion`SELECT * FROM tareas`;

            conexion.end();

            ok(tareas);

        }catch(error){
            
            ko({error : "error en el servidor"});

        }
    })
}

function crearTarea(tarea){
    return new Promise(async (ok,ko) =>{
        const conexion = conectar();
        try{
            let [{id}] = await conexion`INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id`;

            conexion.end();
            
            ok(id);

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

function borrarTarea(id){
    return new Promise(async (ok,ko) =>{
        const conexion = conectar();
        try{
            let {count} = await conexion`DELETE FROM tareas WHERE id = ${id}`;

            conexion.end();
            
            ok(count);

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}


function toggleEstado(id){
    return new Promise(async (ok,ko) =>{
        try{
            const conexion = conectar();
            let {count} = await conexion`UPDATE  tareas SET terminada = NOT terminada WHERE id = ${id}`;

            conexion.end();
            
            ok(count);

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

function editarTexto(id,tarea){
    return new Promise(async (ok,ko) =>{
        try{
            const conexion = conectar();
            let {count} = await conexion`UPDATE  tareas SET tarea = ${tarea} WHERE id = ${id}`;

            conexion.end();
            
            ok(count);

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}
module.exports = {tareas,crearTarea,borrarTarea,toggleEstado,editarTexto};
