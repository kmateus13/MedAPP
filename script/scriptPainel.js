
// Inicio Verificar se o usuario esta logado

window.onload = () => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const userLogado = document.querySelector('.userLogado')
      const userLogadoMobile = document.querySelector('.userLogadoMobile')
      const dbRef = firebase.database().ref();
      const uid = firebase.auth().currentUser.uid


      dbRef.child('paciente').child(uid).get().then((snapshot) => {


        if (snapshot.exists()) {

          if (user.email === snapshot.val().email) {
            userLogado.innerHTML = `${snapshot.val().username}`
            userLogadoMobile.innerHTML = `${snapshot.val().username}`
            inserirCard()
          }

        }
      })

    } else {
      window.location.replace('index.html')
    }
  })
}
// Fim Verificar se o usuario esta logado








// Inicio Sair da conta
function sairDaConta() {
  firebase.auth().signOut().then(() => {
    window.location.replace('index.html')
  }).catch((error) => {
    alert('Erro ao fazer logout')
  });
}

// Fim Sair da conta


// Inicio Validacao dos inputs de Especialidades e Medicos

function selected() {
  const especialistas = {

    cardiologia: ['Dr. José de Alencar', 'Dr. Pedro Brugada', 'Dra.Ludhmila Hajjar'],
    dermatologia: ['Dra. Ana Cristina Trench', 'Dra. Juliana Mossini Nicoliello', 'Dra. Aline Tiemi Asahi Baptista'],
    ginecologiaEObstetricia: ['Dra. Adriana Helena Ramos Faro Gulias', 'Dr. Rodrigo Miyazima', 'Dra. Alexandra Ongaratto']

  }

  const select = document.querySelector('#especialidades')
  const valor = select.options[select.selectedIndex].value
  const doutores = document.querySelector('#doutores')
  const iptData = document.querySelector('#data')

  if (valor === 'cardiologia') {
    // for (let i = 0; i < 3; i++) {
    //   console.log()
    // }
    doutores.disabled = false
    iptData.disabled = false
    doutores.innerHTML = '<option value=""></option>'
    for (let i in especialistas.cardiologia) {
      doutores.innerHTML += `<option value="${especialistas.cardiologia[i]}">${especialistas.cardiologia[i]}</option>`
    }

  } else if (valor === 'dermatologia') {
    doutores.disabled = false
    iptData.disabled = false
    doutores.innerHTML = '<option value=""></option>'
    for (let i in especialistas.dermatologia) {
      doutores.innerHTML += `<option value="${especialistas.dermatologia[i]}">${especialistas.dermatologia[i]}</option>`
    }

  } else if (valor === 'ginecologiaEObstetricia') {
    doutores.disabled = false
    iptData.disabled = false
    doutores.innerHTML = '<option value=""></option>'
    for (let i in especialistas.ginecologiaEObstetricia) {
      doutores.innerHTML += `<option value="${especialistas.ginecologiaEObstetricia[i]}">${especialistas.ginecologiaEObstetricia[i]}</option>`
    }

  } else {
    doutores.disabled = true
    iptData.disabled = true
  }

}
// Fim Validacao dos inputs de Especialidades e Medicos




// Inicio Enviar dados para o banco de dados
function inserirDados() {

  const select = document.querySelector('#especialidades')
  const valor = select.options[select.selectedIndex]
  const selectMedico = document.querySelector('#doutores')
  const medicoValor = selectMedico.options[selectMedico.selectedIndex]
  const iptData = document.querySelector('#data')
  const uid = firebase.auth().currentUser.uid


  if(iptData.value.length !== 0 && medicoValor.value.length !== 0 && valor.value.length !== 0){
    const dados = {
    data: iptData.value,
    especialidade: valor.text,
    medico: medicoValor.value
  }

  firebase.database().ref('paciente').child(uid).child('agendamentos').push(dados)
  exibirModal(consultaMarcada)
  }


  

}
// Fim Enviar dados para o banco de dados



// Recarregar Pagina
function reload() {
  window.location.reload(true);
}



// Inicio inserir card consultas
function inserirCard() {
  const uid = firebase.auth().currentUser.uid
  const div = document.querySelector('#consultas')
  const dbRef = firebase.database().ref();

  dbRef.child('paciente').child(uid).child('agendamentos').get().then((snapshot) => {
    if (snapshot.exists()) {

      const snapshotVal = snapshot.val();
      const indici = Object.keys(snapshotVal);

      for (let i = 0; i < indici.length; i++) {
        const key = indici[i];
        const dados = snapshotVal[key];

        div.innerHTML += `<div class="${key}" id="card">
          <h1>Consulta n° ${i + 1}</h1>
          <div class="campoData">
              <h3>Data:</h3>
              <h3>${dados.data}</h3>
           </div>
          <div class="campoEspecialidade">
              <h3>Especialidade:</h3>
              <h3>${dados.especialidade}</h3>
            </div>
          <div class="campoMedico">
              <h3>Medico:</h3>
              <h3>${dados.medico}</h3>
            </div>
         <div><input type="button" value="Cancelar" onclick="removerDados(${i})"></div>
          </div>`;
      }
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });

}
// Fim inserir card consultas

// Remover Dados
function removerDados(e) {

  const uid = firebase.auth().currentUser.uid
  const dbRef = firebase.database().ref();
  

  dbRef.child('paciente').child(uid).child('agendamentos').get().then((snapshot) => {
    if (snapshot.exists()) {
      const indici = Object.keys(snapshot.val())
      let div = document.querySelector(`.${indici[e]}`)

      div.remove()
      firebase.database().ref('paciente').child(uid).child('agendamentos').child(`${indici[e]}`).remove()
      
    } else {
      console.log("No data available");
    }
  })

}






// Inicio Acoes Navbar

const divInicio = document.querySelector('#inicio')
const divAgendar = document.querySelector('#agendar')
const divConsultas = document.querySelector('#consultas')
const divSobre = document.querySelector('#sobre')

function abrirInicio() {
  divInicio.style.visibility = 'visible'
  divAgendar.style.visibility = 'hidden'
  divConsultas.style.visibility = 'hidden'
  divSobre.style.visibility = 'hidden'
}

function abrirAgendar() {
  divInicio.style.visibility = 'hidden'
  divAgendar.style.visibility = 'visible'
  divConsultas.style.visibility = 'hidden'
  divSobre.style.visibility = 'hidden'
}

function abrirConsultas() {
  divInicio.style.visibility = 'hidden'
  divAgendar.style.visibility = 'hidden'
  divConsultas.style.visibility = 'visible'
  divSobre.style.visibility = 'hidden'
}

function abrirSobre() {
  divInicio.style.visibility = 'hidden'
  divAgendar.style.visibility = 'hidden'
  divConsultas.style.visibility = 'hidden'
  divSobre.style.visibility = 'visible'
}


// Fim Acoes Navbar



// Inicio Navbar Mobile
const btnOpen = document.getElementById('open-nav')
const btnClose = document.getElementById('close-nav')
const menu = document.getElementById('navbar-mobile')

btnOpen.addEventListener('click', () => {
  menu.classList.add('menu-active')
})

btnClose.addEventListener('click', () => {
  menu.classList.remove('menu-active')
})

menu.addEventListener('click', () => {
  setTimeout(() => {
    if (menu.classList.contains('menu-active')) {
      menu.classList.remove('menu-active')
    }
  }, 100)
})

// Fim navbar Mobile




let consultaMarcada = 'Consulta agendada com sucesso!'

function exibirModal(e) {
  const modal = document.querySelector('dialog')
  const closeModal = document.querySelector('.close')
  const campoFrase = document.querySelector('dialog p')


  campoFrase.innerHTML = `${e}`
  modal.showModal()


  closeModal.addEventListener('click', () => {
      modal.close()
      reload()
  })


}


