async function logar(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const data = { email, senha };

    const response = await fetch('http://localhost:3001/usuario/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const results = await response.json();
    console.log(response.data);

    if (results.success) {
        const usuario = results.data;

        // Console com os dados
        console.log("Informações da conta logada:", usuario);

        localStorage.setItem("usuario_id", usuario.id);
        localStorage.setItem("usuario_nome", usuario.nome);
        localStorage.setItem("usuario_idade", usuario.idade);
        localStorage.setItem("usuario_email", usuario.email);
        localStorage.setItem("usuario_status", usuario.status);
        localStorage.setItem("Informacoes", JSON.stringify(usuario))

        alert(results.message);
        window.location.href = "../paginaInicial/index.html";
    } else {
        alert(results.message);
    }
}
