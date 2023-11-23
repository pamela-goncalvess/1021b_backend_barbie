import express from 'express'
import ListaFilme from './aplicacao/lista-filme.use-case'
import BancoMongoDB from './infra/banco/banco-mongodb'
import SalvaFilme from './aplicacao/salva-filme.use-case'
import cors from "cors"

const app = express()
const bancoMongoDB = new BancoMongoDB()
app.use(express.json())
app.use(cors())

type Filme = {
    id:number,
    titulo:string,
    descricao:string,
    imagem:string
}
let filmesCadastros:Filme[] = []
app.post('/filmes', async(req,res)=>{
    const {id,titulo,descricao,imagem} = req.body
    const filme = {
        id,
        titulo,
        descricao,
        imagem
    }
    try{
       const salvaFilme = new SalvaFilme(bancoMongoDB)
    const filmes = await salvaFilme.execute(filme)
    /*filmesCadastros.push(filme)*/
    res.status(201).send(filme)
}catch(error){
    res.status(404).send("Filme já adicionado.");
}
})

app.get('/filmes',async (req,res)=>{
    //usem o listarFilme Usecase para listar os filmes
    const listaFilme = new ListaFilme(bancoMongoDB)
    const filmes = await listaFilme.executar()
    res.send(filmes)
})

app.get('/filmes/:id',(req,res)=>{
    const id = parseInt(req.params.id)
    //FIND para buscar um filme pelo id e retornar para o usuário
    const filme = filmesCadastros.find(filme => filme.id === id)
    if(!filme) return res.status(404).send("Filme não encontrado")
    res.status(200).send(filme)
})

//Tenho que iniciar o servidor na porta 3000
app.listen(3000,()=>{
    console.log('Servidor rodando na porta 3000.')
})



