
// Inicio Alterar entre Login e Registrar
function mostrarCampos() {
    const registrar = document.querySelector('.primeira')
    const login = document.querySelector('.segunda')
    if (registrar.style.visibility === 'hidden') {
        registrar.style.visibility = 'visible'
        login.style.visibility = 'hidden'
    } else {
        registrar.style.visibility = 'hidden'
        login.style.visibility = 'visible'
    }
}

// Fim Alterar entre Login e Registrar


// Inicio mostrar senha
const mostrarSenha = document.querySelector('.fa-eye')
const iptLog = document.querySelector('#password')

mostrarSenha.addEventListener('click', () => {
    if (iptLog.type === 'password') {
        iptLog.setAttribute('type', 'text')
        mostrarSenha.classList.remove('fa-eye')
        mostrarSenha.classList.add('fa-eye-slash')
    } else {
        iptLog.setAttribute('type', 'password')
        mostrarSenha.classList.remove('fa-eye-slash')
        mostrarSenha.classList.add('fa-eye')
    }
})

// Fim mostrar senha



//  Validação pagina cadastro
const name = document.querySelector('#name')
const email = document.querySelector('#email')
const senha1 = document.querySelector('#cd-password')
const contraSenha = document.querySelector('#repeat-password')
const registrar = document.querySelector('.primeira')
const login = document.querySelector('.segunda')


function cadastrar() {
    if (name.value.length == 0 || email.value.length == 0 || senha1.value.length == 0 || contraSenha.value.length == 0) {
        exibirModal(campoEmBranco)
    } else {
        if (senha1.value.length > 5) {

            if (senha1.value === contraSenha.value) {
                firebase.auth().createUserWithEmailAndPassword(email.value, senha1.value)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;
                        console.log(user)
                        inserirDados()
                        name.value = ""
                        email.value = ""
                        senha1.value = ""
                        contraSenha.value = ""
                        exibirModal(cadastrado)
                        mostrarCampos()
                    })
                    .catch(() => {
                        exibirModal(erroEmail)
                    });
            } else {
                senha1.style.cssText = "border-bottom: 1px solid red;"
                contraSenha.style.cssText = "border-bottom: 1px solid red;"
                exibirModal(senhaDivergente)
            }

        } else {
            senha1.style.cssText = "border-bottom: 1px solid red;"
            exibirModal(senhaMinima)

        }


    }


}

function inserirDados() {



    const uid = firebase.auth().currentUser.uid

    const dados = {
        email: email.value,
        username: name.value
    }

    firebase.database().ref('paciente').child(uid).set(dados)
}





function entrar() {
    const user = document.querySelector("#user")
    const senha = document.querySelector('#password')

    if (user.value.length !== 0 && senha.value.length !== 0) {
        firebase.auth().signInWithEmailAndPassword(user.value, senha.value)
            .then((userCredential) => {
                // Signed in
                var user = userCredential.user;
                console.log('conectado')
                window.location.replace('painel.html')
            })
            .catch((error) => {
                exibirModal(emailValido)
            });
    } else {
        exibirModal(campoEmBranco)
    }


}

let cadastrado = 'Cadastrado com sucesso!'
let campoEmBranco = 'Um ou mais campos estão em branco!'
let senhaMinima = 'A senha deve conter no minimo 6 caracteres!'
let senhaDivergente = 'As senhas são divergentes!'
let erroEmail = 'E-mail inválido ou já cadastrado!'
let emailValido = 'E-mail ou senha inválido'

function exibirModal(e) {
    const modal = document.querySelector('dialog')
    const closeModal = document.querySelector('.close')
    const campoFrase = document.querySelector('dialog p')


    campoFrase.innerHTML = `${e}`
    modal.showModal()


    closeModal.addEventListener('click', () => {
        modal.close()
    })


}


