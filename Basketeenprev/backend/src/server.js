const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

//definir a porta
const porta = 3001;
const app = express();
//habilitar o cors e utilizar json
app.use(cors());
app.use(express.json());

//testar
app.listen(porta, () => console.log(`Servidor rodando na porta ${porta}`));

const connection = require('./db_config');


// Cadastrar Usuário

app.post('/usuario/cadastrar', (request, response) => {
    let params = Array(
        request.body.nome,
        request.body.idade,
        request.body.email,
        request.body.senha,
        request.body.codigo || null,
        request.body.status
    );
    console.log(params)
    // let query = "INSERT INTO usuario(nome, idade, email, senha, status) values(?,?,?,?,?);";
    let query = "INSERT INTO usuario(nome, idade, email, senha, codigo, status) values(?,?,?,?,?,?);";

    connection.query(query, params, (err, results) => {
        if (results) {
            response
                .status(201)
                .json({
                    success: true,
                    message: "Sucesso no cadastro",
                    data: results
                })

        } else {
            response
                .status(400)
                .json({
                    success: false,
                    message: "Erro no cadastro",
                    data: err
                })
        }
    })
});


// Login Usuário

app.post('/usuario/login', (request, response) => {
    const { email, senha } = request.body;

    if (!email || !senha) {
        return response.status(400).json({
            success: false,
            message: "E-mail e senha são obrigatórios!"
        });
    }

    // const query = "SELECT id, nome, idade, email, senha, status FROM usuario WHERE email = ?";
    const query = "SELECT id, nome, idade, email, senha, codigo, status FROM usuario WHERE email = ?";

    connection.query(query, [email], (err, results) => {
        if (err) {
            return response.status(500).json({
                success: false,
                message: "Erro no servidor",
                error: err
            });
        }

        if (results.length === 0) {
            return response.status(400).json({
                success: false,
                message: "E-mail não cadastrado"
            });
        }

        const usuario = results[0];
        const senhaBanco = usuario.senha;

        if (senhaBanco === senha) {
            return response.status(200).json({
                success: true,
                message: "Sucesso",
                data: {
                    id: usuario.id,
                    nome: usuario.nome,
                    idade: usuario.idade,
                    email: usuario.email,
                    status: usuario.status,
                    senha: usuario.senha,
                    codigo: usuario.codigo
                }
            });
        } else {
            return response.status(400).json({
                success: false,
                message: "Verifique sua senha!"
            });
        }
    });
});


// -----------------------------------------

// LISTAR OS POST



app.get("/listar/post", (req, res) => {
    const query = "SELECT titulo, texto, imagem FROM postar ORDER BY id DESC";
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Erro ao listar posts:", err);
        return res.status(500).json({ message: "Erro ao listar posts", error: err });
      }
      res.status(200).json(results);
    });
  });


// -----------------------------------------

// EDITAR USUÁRIO

app.put('/editar/:id', (req, res) => {
    const { id, email, senha } = req.body;

    const query = `
        UPDATE usuario 
        SET email = ?, senha = ?
        WHERE id = ?;
    `;
    const values = [email, senha, id];

    connection.query(query, values, (err, response) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao editar usuário", error: err });
        }
            // if (result.affectedRows === 0) {
            //     return res.status(404).json({ success: false, message: "Usuário não encontrado" });
            // }
        res.status(200).json({ success: true, message: "Usuário editado com sucesso" });
    });
});

// -----------------------------------------

// DELETAR USUÁRIO

app.delete('/remover/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM usuario WHERE id = ?`;

    connection.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao remover usuário", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado" });
        }
        res.status(200).json({ success: true, message: "Usuário removido com sucesso" });
    });
});

// -----------------------------------------

// LISTAR USUÁRIO

app.get('/usuario/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT id, nome, idade, email, senha, status FROM usuario WHERE id = ?`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Erro ao buscar usuário", error: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Usuário não encontrado" });
        }
        res.status(200).json({ success: true, data: results[0] });
    });
});

// -----------------------------------------



// MULTER

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`);
    },
  });
  const upload = multer({ storage });
   
   
  app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

//   ----------------------------------------------------

// CRIAR POST


app.post("/usuario/postar", upload.single("imagem"), (req, res) => {
    const { titulo, texto } = req.body;
    const filename = req.file ? req.file.filename : null;
    const imagem = filename ? filename : null; // apenas o nome do arquivo (sem /uploads/)
  
    if (!titulo || !texto) {
      return res.status(400).json({
        success: false,
        message: "Título e texto são obrigatórios!",
      });
    }
  
    const query = "INSERT INTO postar (titulo, texto, imagem) VALUES (?, ?, ?)";
  
    connection.query(query, [titulo, texto, imagem], (err, results) => {
      if (err) {
        console.error("Erro ao inserir post:", err);
        return res.status(500).json({
          success: false,
          message: "Erro ao salvar post no banco de dados.",
          error: err,
        });
      }
  
      // Buscar o post recém-criado
      connection.query("SELECT titulo, texto, imagem FROM postar WHERE id = ?", [results.insertId], (err2, rows) => {
        if (err2 || !rows || rows.length === 0) {
          console.error("Erro ao recuperar o post:", err2);
          return res.status(200).json({
            success: true,
            message: "Post criado, mas não foi possível recuperar do banco.",
            data: {
              id: results.insertId,
              titulo,
              texto,
              imagem,
            },
          });
        }
  
        const row = rows[0];
        const post = {
          id: row.id,
          titulo: row.titulo,
          texto: row.texto,
          imagem: row.imagem,
        };
  
        return res.status(200).json({
          success: true,
          message: "Post criado com sucesso!",
          data: post,
        });
      });
    });
  });