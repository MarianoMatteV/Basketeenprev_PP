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