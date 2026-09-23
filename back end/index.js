import express from "express";

const app = express();

app.get("/", (req, res) =>{
  res.json("Você acessou a rota inicial!")
});

app.listen(3000, () => {
  console.log("Servidor funcionando");
})