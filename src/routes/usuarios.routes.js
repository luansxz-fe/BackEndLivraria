import {
    criarUsuario,
    listaUsuarios, 
    obterUsuario,
    atualizaUsuario,
    deletarUsuario} from "../controllers/usuarios.controller.js";

    import express from "express";

    const router = express.Router();

    router.get("/", listaUsuarios);
    router.post("/", criarUsuario);
    router.get("/", obterUsuario);
    router.put("/", atualizaUsuario);
    router.delete("/", deletarUsuario);

    export default router;