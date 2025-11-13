# Basketeenprev - Projeto Profissional


## 1. Tema do Projeto

O projeto desenvolvido possui como tema **“Prevenção de lesões em jovens praticantes de basquete”**, a partir disso foi criado um Web Site informativo, com o objetivo de **fornecer informações acessíveis e confiáveis sobre os principais tipos de lesões que ocorrem nos jovens atletas**, apresentando **dicas de prevenção, alongamentos, cuidados fisioterapêuticos e boas práticas** durante o treinamento.

A proposta surge da necessidade de **divulgar conteúdos educativos e preventivos**, visto que o número de lesões em adolescentes que praticam basquete vem crescendo. Assim, o site atua como uma ferramenta de conscientização e orientação.

---

## 2. Sobre

- Para o desenvolvimento do projeto, foram utilizadas as linguagens HTML, CSS, JavaScript e um pouco de Python. Para que assim fosse possível criar uma interface navegável e funcional, visando facilitar aos usuários a busca pelas informações sobre lesões e como evitá-las.

- Foram criadas diversas páginas para o desenvolvimento do site: página de Cadastro, na qual o usuário deve preencher com as informações solicitadas (caso o usuário seja um fisioterapeuta, é necessário preencher um campo adicional com o seu código CREFITO OU COFFITO), após isso o usuário é direcionado para a página de login, na qual preenche os campos com o e-mail e senha. Após essas etapas, o usuário é direcionado para a página inicial, que apresenta o site de maneira resumida. Há também as páginas de tabela (possui tabelas informativas), gráfico (apresenta gráficos sobre as lesões), vídeos informativos e a página principal, na qual o usuário pode ver os posts publicados por fisioterapeutas; os fisioterapeutas podem colocar nos posts: título, texto e imagem (multer). Além dessas páginas, existe a página do usuário, na qual ele pode editar seu e-mail e senha, assim como excluir a conta. Por fim a página de chamada de vídeo, que estava planejada na proposta de desenvolvimento do site, porém não foi possível concluí-la, visto que ainda apresenta erros.


---

## 3. Objetivos

### 3.1 Geral: 
Desenvolver um Web Site informativo sobre prevenção de lesões para jovens que praticam basquete, visando conscientizá-los e diminuir os casos de lesões em jovens atletas.

### 3.2 Específicos:
- Propor possíveis soluções para evitar as lesões.

- Desenvolver as páginas de informações, tabelas, gráficos, vídeos informativos e a opção de chamada de vídeo.

---

## 4. Tecnologias Utilizadas

O projeto foi desenvolvido com o uso das seguintes tecnologias e linguagens:

- **HTML5** – Estruturação do conteúdo e das páginas.  
- **CSS3** – Estilização das interfaces e responsividade.  
- **JavaScript** – Interatividade e funcionalidades do site.  
- **Python (Flask)** – Utilizado para a chamada de vídeo.  
- **Ngrok** – Ferramenta para disponibilizar o servidor local na web e realizar testes de acesso remoto.  
- [Node.js](https://nodejs.org/en/)
- [VSCode](https://code.visualstudio.com/) - Plataforma utilizada para desenvolver o frontend e o backend do site. No frontend foi utilizado HTML, CSS e JS, já no backend foi utilizado o CRUD API, para o desenvolvimento das rotas, e o JS. O Python também foi utilizado no frontend para o desenvolvimento da chamada de vídeo.
- [MySQL Workbench](https://https://www.mysql.com/) - Plataforma utilizada para desenvolver o banco de dados do projeto.
- Bibliotecas utilizadas: Nodemon, mysql2, express, cors, multer e dotenv.

---

<!-- --------------------------------------------------------------------------- -->

## 5. Estrutura do Projeto

A estrutura do projeto é organizada da seguinte maneira:

```

Basketeenprev/
├── 📁 backend/  
│   ├── 📁 SQL/       # Script SQL para criação e inicialização do banco de dados.
│   ├── 📁 src/       # Arquivos fonte do servidor (server.js / multer.js / db_config.js) 
│   ├── 📁 uploads/   # Diretório destinado ao armazenamento das imagens enviadas nos posts. 
│   ├── 📄 package.json  
│   │   └── Define dependências e scripts do backend (Node.js).  
│   └── 📄 package-lock.json  
│
├── 📁 frontend/  
│   ├── 📁 Cadastro/          # Arquivos responsáveis pela página de cadastro.  
│   ├── 📁 grafico/           # Arquivos responsáveis pela página de gráficos.  
│   ├── 📁 imagens/           # Armazena imagens das logos e ícones utilizados no site.  
│   ├── 📁 login/             # Arquivos responsáveis pela página de login 
│   ├── 📁 paginainicial/     # Arquivos responsáveis pela página inicial e verificação
│   ├── 📁 paginaPrincipal/   # Arquivos responsáveis pela página principal 
│   ├── 📁 tabelas/           # Arquivos responsáveis pela página de tabelas
│   ├── 📁 Usuario/           # Arquivos responsáveis pela página de usuários
│   ├── 📁 videos/            # Arquivos responsáveis pela página de vídeos
│   └── 📁 videochat-webrtc/  
│       ├── 📁 static/        # JS e CSS da chamada de vídeo
│       ├── 📁 templates/     # HTML da chamada de vídeo 
│       ├── 📄 server.py — servidor principal responsável por gerenciar a aplicação e as conexões WebSocket.  
│       ├── 📄 requirements.txt — lista de dependências Python necessárias para execução do servidor.  
│
├── 📄 README.md  
│   └── Documentação do projeto.  


```

<!-- ----------------------------------------------------------------------------- -->

## 6. Pré-requisitos

- Certifique-se de ter instalado em seu computador o MySQL Workbench, [Node.js](https://nodejs.org/en/), [VSCode](https://code.visualstudio.com/) e Git Bash.

## 7. Instalação (Node JS)

```bash
# Clone este repositório
$ git clone <>

# Acesse a pasta do projeto no terminal/cmd
$ cd basketeenprev

# Vá para a pasta do backend
$ cd backend

# Instale as dependências
$ npm i

# Execute a aplicação
$ npm start


```

## 8. Como usar

### MySQL
- Abra o MySQL e selecione o workbench, use a senha "root" para acessá-la.

- Copie o código do arquivo MySQL presente no arquivo do VScode, cole no workbench do MySQL e certifique-se de salvar para testar o código, utilizando "ctrl + enter" em todo ele, ou selecionando todo código e clicando no ícone do raio.

## 9. Testando as API

- Para testar as API, certifique-se de que esteja instalado no computador o thunder client (Caso não tenha instalado o thunder client, clique na opção extensões, no VScode, e pesquise por thunder client, então é só instalar).

- Abra o Thunder client no Visual code.

- Clique na opção New request.

- Selecione o método a ser utilizado.

- Adicione a URL aonde se pede.

- Clique na opção "Body", abaixo de onde é inserido a URL, e teste de acordo com os exemplos mostrados abaixo.

- Após isso, clique na opção "Send" (certifique-se de que o npm esteja rodando. Caso não esteja, utilize o "npm start").


## 10. Funcionalidades implementadas:
- Transição de uma página para outra

- Cadastrar usuário

- Login

- Fisioterapeuta publicar posts

- Editar informações

- Excluir conta

- Listar posts

- Listar usuários


---

## 11. Funcionalidades Principais

### 11.1 Autenticação de Usuário

| Método | Rota | Função |
|--------|------|--------|
| POST | `/usuario/cadastrar` | Cadastra novo usuário |
| POST | `/usuario/login` | Realiza login do usuário |
| DELETE | `/remover/:id` | Remove usuário pelo id |
| PUT | `/editar/:id` | Edita email e senha |
| GET | `/usuario/:id` | Lista informações do usuário |

### 11.2 Publicações

| Método | Rota | Função |
|--------|------|--------|
| POST | `/usuario/postar` | Publica o post |
| GET | `/listar/post` | Lista os posts |


**Desenvolvido por Mariano Matte Viegas**
