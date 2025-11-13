function pagInicial(event){
    window.location.href = "../paginaInicial/index.html";
}

function pagPrincipal(event){
    window.location.href = "../paginaPrincipal/paginaPrincipal.html";
}
function pagTabelas(event){
    window.location.href = "../tabelas/tabelas.html";
}
function pagVideos(event){
    window.location.href = "../videos/videos.html";
}
function pagGraficos(event){
    window.location.href = "../grafico/graficos.html";
}
function chamadaVideo(event){
    window.location.href = "../videochat-webrtc/templates/videoChamada.html";
}
function pagUsuario(){
    const dados = JSON.parse(localStorage.getItem('Informacoes'));
    if(dados){
        window.location.href = "../usuario/usuario.html";
    }else{
        window.location.href = "../Cadastro/cadastro.html";
    }
    
}

// function verificarLogin() {
//     const logado = localStorage.getItem("Informacoes");

//     if (!logado) {
//         // Redireciona para a página de cadastro se o usuário não estiver logado
//         window.location.href = "../Cadastro/cadastro.html";
//     }
// }

// document.addEventListener("DOMContentLoaded", () => {
//     verificarLogin();
// });