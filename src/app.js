const express = require("express");
const cors    = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

  /** 
   * Métodos HTTP:
   * 
   * GET: Buscar informações do back-end
   * POST: Criar uma informação no back-end
   * PUT/PATCH: Alterar uma informação no back-end
   * DELETE: Deletar uma informação no back-end
   *
   * *
   * Tipos de parâmetros:
   * 
   * Query Params:   Filtros e paginação
   * Route Params:   Identificar recursos na hora de atualizar ou deletar 
   * Request Params: 
   */

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories); // lista todos repositórios
});

app.post("/repositories", (request, response) => {
  const {title, url, techs } = request.body;
  
  // cria um objeto
  repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  // insere o objeto dentro do array de repositórios
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  // realiza busca do repositório no array pelo id
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // caso não seja encontrado
  if(repositoryIndex < 0){
    return response.status(400).send();
  }

  // caso seja encontrado
  const repository = { 
    id, 
    title, 
    url, 
    techs, 
    likes: repositories[repositoryIndex].likes, };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  // realiza busca do repositório no array pelo id
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  // caso não seja encontrado
  if(repositoryIndex < 0){
    return response.status(400).json({ error: "Repository not found." });
  }

  // caso seja encontrado
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  // realiza busca do repositório no array pelo id
  const repository = repositories.find(repository => repository.id === id);

  // caso não seja encontrado
  if(!repository){
    return response.status(400).send();
  }

  // caso seja encontrado
  repository.likes++;

  return response.json(repository);
});

module.exports = app;

