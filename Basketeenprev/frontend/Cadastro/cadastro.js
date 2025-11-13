async function cadastrarUsuario(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const codigo = document.getElementById('codigo').value;
    const status = document.getElementById('status').value;

    // const data = {nome,idade,email,senha,status};
    const data = {nome,idade,email,senha,codigo,status};


    const response = await fetch('http://localhost:3001/usuario/cadastrar', {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    })

    const results = await response.json();

    console.log(results);

    if(results.success) {
        window.location.href = "../login/login.html"
        alert(results.message)
    } else {
        alert(alert.message)
    }
}

// ----------------------------------

// Verificação do fisioterapeuta

// document.addEventListener('DOMContentLoaded', () => {
//     const userTypeSelect = document.getElementById('userType');
//     const verificationField = document.querySelector('.verificacao'); // Seleciona o campo com a classe 'verificacao'

//     userTypeSelect.addEventListener('change', () => {
//         if (userTypeSelect.value === 'fisioterapeuta') {
//             verificationField.style.display = 'block'; // Torna o campo visível
//         } else {
//             verificationField.style.display = 'none'; // Oculta o campo
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const statusSelect = document.getElementById('status');
    const verificationField = document.querySelector('.verificacao');
    
    statusSelect.addEventListener('change', () => {
        if (statusSelect.value === 'fisioterapeuta') {
            verificationField.style.display = 'block';
        } else {
            verificationField.style.display = 'none';
        }
    });
});