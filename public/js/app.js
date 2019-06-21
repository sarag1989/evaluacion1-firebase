//Autor: Sara Gharafi Abalkais.
//Fecha: 14/06/2019
//Ejercicio: primera evaluacion de "publicacion de páginas web"

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDNL8OvH2xvvtti80E6s4jFlMvT3KOz7QQ",
  authDomain: "usuarios-8c78b.firebaseapp.com",
  databaseURL: "https://usuarios-8c78b.firebaseio.com",
  projectId: "usuarios-8c78b",
  storageBucket: "usuarios-8c78b.appspot.com",
  messagingSenderId: "379888038415",
  appId: "1:379888038415:web:d7046f7c3c540ba7"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Definción de eventos para botones de registro y conexión
var re = document.getElementById("registrar");
re.addEventListener("click", registrar, false);
var co = document.getElementById("conectar");
co.addEventListener("click", conectar, false);

function registrar() {
  var email = document.getElementById("email1").value;
  var password = document.getElementById("password1").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function () {
      confirmar();
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
      $("#modalRegistro").modal('hide');
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function conectar() {
  var email = document.getElementById("email2").value;
  var password = document.getElementById("password2").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function () {
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      alert("Error: " + errorCode + ". " + errorMessage);
    });
}

function observador() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("Existe usuario activo.");
      contenidosUsuarioRegistrado(user);

      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;

      console.log('Usuario verificado: ' + emailVerified);
      $("#botones").css("visibility", "hidden");
      $("#cerrarconexion").css("display", "inline");
    } else {
      // User is signed out.
      console.log("No existe ningún usuario activo.");
      var contenido = document.getElementById("contenido");
      contenido.innerHTML = `
      <p>Conéctate para ver los contenidos exclusivos para usuarios registrados.</p>
      `;
    }
  });
}

function contenidosUsuarioRegistrado(usuario) {
  let contenido = document.getElementById("contenido");

  let territorio = document.getElementById("territorio");
  let fechaInicio = document.getElementById("fechaInicio");
  let fechaFin = document.getElementById("fechaFin");
  let quien = document.getElementById("quien");
  let cuando = document.getElementById("cuando");

  if (usuario.emailVerified) {
    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
        <p>Bienvenido a nuestro portal.</p>
        <hr>
        <p class="mb-0">Tenemos muchos contenidos exclusivos solo para usuarios registrados como tú.</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <h2>Agregar usuarios</h2>

      <div class="form-inline">
        <label for="tTerritorio" class="col-sm-2 col-form-label">Tipo de territorio<sub>(*)</sub>: </label>
        <input type="number" id="tTerritorio" placeholder="Introduce un territorio" class="form-control my-1 col-sm-3" min="1" max="10" required onblur="validarTipoTerritorio();">
        <span id="uno"></span>
      </div>
      <div class="form-inline">
        <label for="territorio" class="col-sm-2 col-form-label">Id del territorio<sub>(*)</sub>: </label>
        <input type="number" id="territorio" placeholder="Introduce un territorio" class="form-control my-3 col-sm-3" min="1" max="300" required onblur="validarTerritorio();">
        <span id="dos"></span>
      </div>
      <div class="form-inline">
        <label for="fechaInicio" class="col-sm-2 col-form-label">Fecha de incio<sub>(*)</sub>: </label>
        <input type="date" id="fechaInicio" placeholder="Introduce la fecha de inicio" class="form-control my-3 col-sm-3" required onblur="validarFechaInicio(fechaInicio);">
        <span id="tres"></span>
      </div>
      <div class="form-inline">
        <label for="fechaFin" class="col-sm-2 col-form-label">Fecha fin<sub>(*)</sub>: </label>
        <input type="date" id="fechaFin" placeholder="Introduce la fecha final" class="form-control my-3 col-sm-3" required onblur="compararInicioFin(fechaInicio, fechaFin);">
        <span id="cuatro"></span>
      </div>
      <div class="form-inline">
        <label for="quien" class="col-sm-2 col-form-label">Quién<sub>(*)</sub>: </label>
        <input type="number" id="quien" placeholder="Introduce el id del agente que ha realizado el trabajo" class="form-control my-3 col-sm-3" min="1" max="120" required onblur="validarQuien(quien);">
        <span id="cinco"></span>
      </div>
      <div class="form-inline">
        <label for="cuando" class="col-sm-2 col-form-label">Cuándo<sub>(*)</sub>: </label>
        <input type="text" id="cuando" placeholder="Introduce un comentario de su trabajo" class="form-control my-2 col-sm-3" maxlenght="50" required onblur="validarCuando(cuando);">
        <span id="seis"></span>
      </div>
      <button class="btn btn-info my-3" id="guardar" onclick="return validarTabla();">Guardar</button>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tipo de territorio</th>
            <th scope="col">Id del territorio</th>
            <th scope="col">Fecha inicio</th>
            <th scope="col">Fecha Fin</th>
            <th scope="col">Quién</th>
            <th scope="col">Cuándo</th>
            <th scope="col">Editar</th>
            <th scope="col">Eliminar</th>
          </tr>
        </thead>
        <tbody id="tabla">
        </tbody>
      </table>
    `;
    cargarTabla();
    $("#cerrarconexion").html(`<button id="cerrar" class="btn btn-danger btn-sm ml-2">Cerrar sesión</button>`);
    var ce = document.getElementById("cerrar");
    ce.addEventListener("click", cerrar, false);
    var gu = document.getElementById("guardar");
    gu.addEventListener("click", guardar, false);
  } else {
    contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <h4 class="alert-heading">¡Bienvenido ${usuario.email}!</h4>
        <p>Activa tu cuenta para ver nuestros contenidos para usuarios registrados.</p>
        <hr>
        <p class="mb-0">Revisa tu correo electrónico</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
  }
}

function validarTabla() {
  if (!validarTipoTerritorio()) {
    return false;
  }
  if (!validarTerritorio()) {
    return false;
  }
  if (!validarFechaInicio(fechaInicio)) {
    return false;
  }
  if (!comprobarInicioFin(fechaInicio, fechaFin)) {
    return false;
  }
  if (!validarQuien(quien)) {
    return false;
  }
  if (!validarCuando(cuando)) {
    return false;
  }
  return true;
}

function validarTipoTerritorio() {
  let tTerritorio = document.getElementById("tTerritorio");
  if (/^(?:[1-9]|0[1-9]|10)$/.test(tTerritorio.value)) {
    $("#uno").html("<i class='far fa-check-square'></i>");
    $("#uno").css("color", "#0A8F36").css("fontSize", "2em");
    return true;
  } else {
    document.getElementById("uno").innerHTML = "Por favor, introduzca un número del 1 al 10.";
    $("#uno").css("color", "#D60100").css("fontSize", "1em");
    return false;
  }
}

function validarTerritorio() {
  let territorio = document.getElementById("territorio");
  if (/^(?:[1-9]\d?|[12]\d{2}|300)$/.test(territorio.value)) {
    $("#dos").html("<i class='far fa-check-square'></i>");
    $("#dos").css("color", "#0A8F36").css("fontSize", "2em");
    return true;
  } else {
    document.getElementById("dos").innerHTML = "Por favor, introduzca un número del 1 al 300.";
    $("#dos").css("color", "#D60100").css("fontSize", "1em");
    return false;
  }
}

function validarFechaInicio(fechaInicio) {
  hoyInicio = new Date(); //fecha actual del sistema.
  if (fechaInicio.value <= hoyInicio || fechaInicio.value !== "") {
    $("#tres").html("<i class='far fa-check-square'></i>");
    $("#tres").css("color", "#0A8F36").css("fontSize", "2em");
    return true;
  } else {
    document.getElementById("tres").innerHTML = "Por favor, introduzca una fecha correcta.";
    $("#tres").css("color", "#D60100").css("fontSize", "1em");
    return false;
  }
}

function compararInicioFin(fechaInicio, fechaFin) {
  hoy = new Date();
  if (fechaFin.value >= fechaInicio.value) {
    $("#cuatro").html("<i class='far fa-check-square'></i>");
    $("#cuatro").css("color", "#0A8F36").css("fontSize", "2em");
    return true;
  } else {
    document.getElementById("cuatro").innerHTML = "Por favor, introduzca una fecha correcta.";
    $("#cuatro").css("color", "#D60100").css("fontSize", "1em");
    return false;
  }
}

function validarQuien(quien) {
  if (/^(12[0-0]|1[01][0-9]|[1-9]?[0-9])$/.test(quien)) {
    $("#cinco").html("<i class='far fa-check-square'></i>");
    $("#cinco").css("color", "#0A8F36").css("fontSize", "2em");
    return true;
  } else {
    document.getElementById("cinco").innerHTML = "Por favor, introduzca el número 'ID' del trabajador.";
    $("#cinco").css("color", "#D60100").css("fontSize", "1em");
    return false;
  }
}

function validarCuando(cuando) {
  if (/^([A-Za-zÁÉÍÓÚñáéíóúÑ]{10,50}?$/.test(cuando)) {
    $("#seis").html("<i class='far fa-check-square'></i>");
    $("#seis").css("color", "#0A8F36").css("fontSize", "2em");
    return true;
  } else {
    document.getElementById("seis").innerHTML = "Por favor, introduzca cuándo se ha realizado el trabajo.";
    $("#seis").css("color", "#D60100").css("fontSize", "1em");
    return false;
  }
}

function validarTabla() {
  $("span").click(function () {
    $("div").empty();
  });
}

function cerrar() {
  firebase.auth().signOut()
    .then(function () {
      console.log("Saliendo...");
      $("#botones").css("visibility", "visible");
      $("#cerrarconexion").css("display", "none");
      contenido.innerHTML = `
      <div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        <strong>¡Cáspitas!</strong> Esperamos verte pronto otra vez por nuestro portal.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      `;
      cerrarconexion.innerHTML = "";
    })
    .catch(function (error) {
      console.log(error);
    });
}

function confirmar() {
  var user = firebase.auth().currentUser;

  user.sendEmailVerification().then(function () {
    // Email sent.
    console.log("Enviando correo...");
  }).catch(function (error) {
    // An error happened.
    console.log(error);
  });
}

function guardar() {
  var usuario = {
    tTerritorio: document.getElementById("tTerritorio").value,
    territorio: document.getElementById("territorio").value,
    fechaInicio: document.getElementById("fechaInicio").value,
    fechaFin: document.getElementById("fechaFin").value,
    quien: document.getElementById("quien").value,
    cuando: document.getElementById("cuando").value
  };

  db.collection("usuarios").add(usuario)
    .then(function (docRef) {
      console.log("Documento escrito con ID: ", docRef.id);
      document.getElementById("tTerritorio").value = "";
      document.getElementById("territorio").value = "";
      document.getElementById("fechaInicio").value = "";
      document.getElementById("fechaFin").value = "";
      document.getElementById("quien").value = "";
      document.getElementById("cuando").value = "";
    })
    .catch(function (error) {
      console.error("Error añadiendo el documento: ", error);
    });
}

// Lectura de los documentos
function cargarTabla() {
  db.collection("usuarios").onSnapshot(function (querySnapshot) {
    var tabla = document.getElementById("tabla");
    tabla.innerHTML = "";
    querySnapshot.forEach(function (doc) {
      tabla.innerHTML += `
        <tr>
          <th scope="row">${doc.id}</th>
          <td>${doc.data().tTerritorio}</td>
          <td>${doc.data().territorio}</td>
          <td>${doc.data().fechaInicio}</td>
          <td>${doc.data().fechaFin}</td>
          <td>${doc.data().quien}</td>
          <td>${doc.data().cuando}</td>
          <td><button class="btn btn-success" onclick="editarDatos('${doc.id}', '${doc.data().tTerritorio}', '${doc.data().territorio}', '${doc.data().fechaInicio}', '${doc.data().fechaFin}', '${doc.data().quien}', '${doc.data().cuando}');">Editar</button></td>
          <td><button class="btn btn-danger" onclick="borrarDatos('${doc.id}');">Eliminar</button></td>
        </tr>
      `;
    });
  });
}

// Borrar datos de documentos
function borrarDatos(parId) {
  db.collection("usuarios").doc(parId).delete()
    .then(function () {
      console.log("Usuario borrado correctamente.");
    }).catch(function (error) {
      console.error("Error borrando el usuario: ", error);
    });
}

// Editar datos de documentos
function editarDatos(parId, parTTerritorio, parTerritorio, parFechaIncio, parFechaFin, parQuien, parCuando) {
  document.getElementById("tTerritorio").value = parTTerritorio;
  document.getElementById("territorio").value = parTerritorio;
  document.getElementById("fechaInicio").value = parFechaIncio;
  document.getElementById("fechaFin").value = parFechaFin;
  document.getElementById("quien").value = parQuien;
  document.getElementById("cuando").value = parCuando;
  var bot = document.getElementById("actualizar");
  $("#guardar").attr("id", "actualizar");

  bot.removeEventListener('click', guardar, false);

  bot.addEventListener("click", function () {
    var userRef = db.collection("usuarios").doc(parId);

    return userRef.update({
        tTerritorio: document.getElementById("tTerritorio").value,
        territorio: document.getElementById("territorio").value,
        fechaInicio: document.getElementById("fechaInicio").value,
        fechaFin: document.getElementById("fechaFin").value,
        quien: document.getElementById("quien").value,
        cuando: document.getElementById("cuando").value
      })
      .then(function () {
        console.log("Usuario actualizado correctamente.");
        $("#actualizar").attr("id", "guardar");
        bot.addEventListener('click', guardar, false);
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error actualizando usuario: ", error);
      });
  }, false);
}

observador();