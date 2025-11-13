document.addEventListener('DOMContentLoaded', () => {

    const usuario_id = localStorage.getItem('usuario_id');
    const usuario_nome = localStorage.getItem('usuario_nome');
    const usuario_idade = localStorage.getItem('usuario_idade');
    const usuario_email = localStorage.getItem('usuario_email');
    const usuario_status = localStorage.getItem('usuario_status');

    console.log(" ID: " + usuario_id + " nome: " + usuario_nome + " idade: " + usuario_idade + " email: " + usuario_email + " status: " + usuario_status)

    const botaoCriarP = document.querySelector('.postar')

    if (usuario_status === 'usuario') {
        botaoCriarP.style.display = "none"
    }

    loadposts();

});


async function postar(event) {
    const divForm = document.querySelector('.form-post')

    divForm.style.display = "flex"
}


// Criar post
async function enviarPost(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo-p').value;
    const texto = document.getElementById('texto-p').value;
    const imagem = document.getElementById('imagem-p').files[0];
    const formData = new FormData();
    formData.append("titulo", titulo); //para enviar formulários e arquivos para o servidor
    formData.append("texto", texto);
    if (imagem) {
        formData.append("imagem", imagem);
    }

    try {
        const response = await fetch('http://localhost:3001/usuario/postar', {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error("Erro no servidor: " + text);
        }

        const results = await response.json();
        console.log(results);

        document.querySelector('.form-post').style.display = 'none'; //serve pra esconder o formulário após a criação do post

        // Limpam os campos do formulário para o próximo post
        document.getElementById('titulo-p').value = '';
        document.getElementById('texto-p').value = '';
        document.getElementById('imagem-p').value = '';

        loadposts(); //atualizar os posts exibidos na página

    } catch (error) {
        console.error('Erro ao enviar post:', error);
        alert('Erro ao criar o post. Tente novamente.');
    }
}

// --------------------------------------
// LISTAR OS POST
async function loadposts() {
    const divPosts = document.querySelector('.posts-div');

    try {
        const response = await fetch('http://localhost:3001/listar/post');

        if (!response.ok) {
            throw new Error('Erro ao carregar os posts.');
        }

        const posts = await response.json();

        divPosts.innerHTML = ''; //Serve para esvaziar a div para evitar duplicação, antes de adicionar os novos posts.

        posts.forEach(post => {
            let postHTML = `
                <div class="post">
                    <h1 class="titulo-post">${post.titulo}</h1>
                    <p>${post.texto}</p>
            `;
            if (post.imagem) {
                postHTML += `<img src="../../backend/uploads/${post.imagem}" alt="Imagem do post" style="max-width: 100%; height: auto;">`;
            }
            postHTML += `</div>`;

            divPosts.innerHTML += postHTML;
        });

    } catch (error) {
        console.error('Erro:', error);
        divPosts.textContent = 'Não foi possível carregar os posts. Tente novamente mais tarde.';
    }
}



function verificarLogin() {
    const logado = localStorage.getItem("Informacoes");

    if (!logado) {
        // Redireciona para a página de cadastro se o usuário não estiver logado
        window.location.href = "../Cadastro/cadastro.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    verificarLogin();
});