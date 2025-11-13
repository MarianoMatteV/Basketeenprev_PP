document.addEventListener("DOMContentLoaded", () => {
    // const dados = JSON.parse(localStorage.getItem('Informacoes'));

    window.addEventListener("load", () => {
        if (localStorage.getItem("Informacoes")) {
            let dados = JSON.parse(localStorage.getItem('Informacoes'));

            console.log(dados.id)

            const container = document.querySelector(".container");

            const infoHtml = `
                <div id="Informacoes" class="description">
                    <h2>Email: ${dados.email}</h2>
                    <h2>Senha: ${dados.senha}</h2>
                </div>
            `;


            const email = document.getElementById('email');
            const senha = document.getElementById('senha');

            email.value = (dados.email)
            senha.value = (dados.senha)

            const closeBtn = document.getElementById('closeModal');
            const botaoEditar = document.getElementById('botaoEditar');
            const modal = document.getElementById('modal');
            botaoEditar.addEventListener('click', () => {
                modal.style.display = 'block';
            });
            function fecharModal() {
                modal.style.display = 'none';
            }
            closeBtn.addEventListener('click', fecharModal);
        }
        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                fecharModal();
            }
        });
    });

});


// Deletar

async function remover(event) {
    event.preventDefault();

    const confirmacao = confirm("Tem certeza de que deseja excluir sua conta?");

    if (!confirmacao) {
        return;
    }

    const dados = JSON.parse(localStorage.getItem('Informacoes'));

    const id = dados.id;

    const data = { id };
    const response = await fetch(`http://localhost:3001/remover/${id}`, {
        method: 'DELETE',
        params: JSON.stringify(data)
    });

    const result = await response.json();

    if (result.success) {
        localStorage.removeItem("Informacoes");
        localStorage.removeItem("usuario_email");
        localStorage.removeItem("usuario_id");
        localStorage.removeItem("usuario_idade");
        localStorage.removeItem("usuario_nome");
        localStorage.removeItem("usuario_status");
        window.location.href = "../Cadastro/cadastro.html";
    } else {
        alert(result.message || 'Erro ao remover o usuário!');
    }
}


// Editar

async function edit(event) {
    event.preventDefault();

    
    const dados = JSON.parse(localStorage.getItem('Informacoes'));
    console.log(dados);
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const id = dados.id;
    const data = { id, email, senha }
    console.log(data);
    const response = await fetch(`http://localhost:3001/editar/${dados.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const results = await response.json();

    if (results.success) {
        localStorage.setItem("Informacoes", JSON.stringify(data));
        console.log(data);
        console.log('deu certo');
        window.location.href = "../paginaInicial/index.html";
    } else {
        alert(results.message || 'Erro ao editar o usuário!');
    }
}

// -----------------------------------------

// Listar User

async function listarUsuario() {
    localStorage.getItem("Informacoes")
    let dados = JSON.parse(localStorage.getItem('Informacoes'));
    
    const nome = localStorage.getItem("usuario_nome");
    const idade = localStorage.getItem("usuario_idade");
    const status = localStorage.getItem("usuario_status");

    if (!dados || !dados.id) {
        alert("Nenhum usuário logado!");
        window.location.href = '../Cadastro/cadastro.html'
        return;
    }
    if (dados) {

        // Exibe as informações do usuário no console ou na tela
        console.log("Informações do usuário:", dados);

        const container = document.querySelector(".container");
        container.innerHTML = `
            <div id="Informacoes" class="description">
                <h2>ID: ${dados.id}</h2>
                <h2>Nome: ${nome}</h2>
                <h2>Idade: ${idade}</h2>
                <h2>Email: ${dados.email}</h2>
                <h2>Status: ${status}</h2>
                <h2>Senha: ${dados.senha}</h2>
            </div>
        `;
    } else {
        alert(result.message || "Erro ao buscar informações do usuário!");
    }
}

// Chame a função listarUsuario quando a página carregar
document.addEventListener("DOMContentLoaded", listarUsuario());