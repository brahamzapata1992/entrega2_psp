// === POLIFIT - GESTIÓN DE USUARIOS Y RUTINAS ===
document.addEventListener("DOMContentLoaded", () => {

  // === REGISTRO DE NUEVOS USUARIOS ===
  const formRegistro = document.getElementById("form-registro");

  if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
      e.preventDefault();

      // Capturar datos del formulario
      const nombre = document.getElementById("nombre").value.trim();
      const correo = document.getElementById("correo").value.trim();
      const edad = document.getElementById("edad").value;
      const sexo = document.getElementById("sexo").value;
      const estatura = document.getElementById("estatura").value;
      const peso = document.getElementById("peso").value;
      const contraseña = document.getElementById("contraseña").value.trim();
      const mensaje = document.getElementById("mensaje-registro");

      // Validar campos obligatorios
      if (!nombre || !correo || !contraseña) {
        mensaje.style.color = "red";
        mensaje.textContent = "Por favor, completa todos los campos obligatorios ❌";
        return;
      }

      // Obtener usuarios previos (objeto)
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

      // Verificar si el correo ya existe
      if (usuarios[correo]) {
        mensaje.style.color = "red";
        mensaje.textContent = "Este correo ya está registrado ❌";
        return;
      }

      // Guardar usuario nuevo
      usuarios[correo] = { nombre, edad, sexo, estatura, peso, contraseña };
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      // Confirmar registro
      mensaje.style.color = "green";
      mensaje.textContent = "Registro exitoso ✅ Redirigiendo al login...";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    });
  }

  // === LOGIN DE USUARIOS EXISTENTES ===
  const formLogin = document.getElementById("form-login");

  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const usuario = document.getElementById("usuario").value.trim();
      const contraseña = document.getElementById("contraseña").value.trim();
      const mensaje = document.getElementById("mensaje-login");

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || {};

      // Validar existencia y credenciales
      if (!usuarios[usuario]) {
        mensaje.style.color = "red";
        mensaje.textContent = "Usuario no registrado ❌";
        return;
      }

      if (usuarios[usuario].contraseña === contraseña) {
        localStorage.setItem("usuarioActivo", usuario);
        window.location.href = "index.html";
      } else {
        mensaje.style.color = "red";
        mensaje.textContent = "Contraseña incorrecta ❌";
      }
    });
  }

  // === PROTEGER PORTAL (solo si hay usuario activo) ===
  if (window.location.pathname.includes("index.html")) {
    const usuarioActivo = localStorage.getItem("usuarioActivo");

    // Si no hay usuario logueado, redirige al login
    if (!usuarioActivo) {
      window.location.href = "login.html";
    } else {
      // Mostrar datos básicos del usuario
      const usuarios = JSON.parse(localStorage.getItem("usuarios"));
      const datosUsuario = usuarios[usuarioActivo];
      const header = document.querySelector("header");

      if (header && datosUsuario) {
        const bienvenida = document.createElement("p");
        bienvenida.textContent = `Bienvenido, ${datosUsuario.nombre} 👋`;
        bienvenida.style.fontWeight = "bold";
        header.appendChild(bienvenida);

        // Botón de cerrar sesión
        const btnSalir = document.createElement("button");
        btnSalir.textContent = "Cerrar sesión";
        btnSalir.style.marginTop = "10px";
        btnSalir.style.backgroundColor = "#ff5555";
        btnSalir.style.color = "white";
        btnSalir.style.border = "none";
        btnSalir.style.padding = "5px 10px";
        btnSalir.style.borderRadius = "5px";
        btnSalir.style.cursor = "pointer";
        btnSalir.addEventListener("click", () => {
          localStorage.removeItem("usuarioActivo");
          window.location.href = "login.html";
        });

        header.appendChild(btnSalir);
      }
    }
  }

  // === FUNCIONALIDAD PRINCIPAL DEL PORTAL (RUTINAS Y CALORÍAS) ===
  const formEjercicio = document.getElementById("form-ejercicio");
  const formCalorias = document.getElementById("form-calorias");
  let ejerciciosGuardados = JSON.parse(localStorage.getItem("ejerciciosUsuario")) || [];
  let totalCaloriasQuemadas = 0;

  if (formEjercicio && formCalorias) {
    const listaEjercicios = document.getElementById("listaEjercicios");
    const listaCalorias = document.getElementById("listaCalorias");
    const totalMinutosEl = document.getElementById("totalMinutos");
    const totalCaloriasEl = document.getElementById("totalCalorias");
    const totalCaloriasQuemadasEl = document.getElementById("totalCaloriasQuemadas");

    let totalMinutos = 0;
    let totalCalorias = 0;

 // === REGISTRO DE EJERCICIOS CON CÁLCULO AUTOMÁTICO DE CALORÍAS ===
formEjercicio.addEventListener("submit", (e) => {
  e.preventDefault();

  const ejercicio = document.getElementById("tipoEjercicio").value;
  const minutos = parseInt(document.getElementById("minutosEjercicio").value);

  if (!ejercicio || isNaN(minutos)) return;

  // Calorías por minuto según tipo
  const caloriasPorMinuto = {
    "cardio": 10,
    "pesas": 6,
    "correr": 12,
    "caminata": 4,
    "hiit": 15
  };

  const caloriasQuemadas = (caloriasPorMinuto[ejercicio] || 5) * minutos;
  totalCaloriasQuemadas += caloriasQuemadas;
  totalCaloriasQuemadasEl.textContent = totalCaloriasQuemadas;

  // Mostrar en la lista
  const li = document.createElement("li");
  li.textContent = `${ejercicio} - ${minutos} min - ${caloriasQuemadas} cal`;
  listaEjercicios.appendChild(li);

  // Actualizar totales
  totalMinutos += minutos;
  totalMinutosEl.textContent = totalMinutos;

  totalCalorias += caloriasQuemadas;
  totalCaloriasEl.textContent = totalCalorias;

  // === GUARDAR EN LOCALSTORAGE ===
  ejerciciosGuardados.push({
    ejercicio,
    minutos,
    calorias: caloriasQuemadas
  });

  localStorage.setItem("ejerciciosUsuario", JSON.stringify(ejerciciosGuardados));

  formEjercicio.reset();
});

 

    // Registrar comida/calorías
    formCalorias.addEventListener("submit", (e) => {
      e.preventDefault();
      const comida = document.getElementById("nombreComida").value;
      const calorias = parseInt(document.getElementById("caloriasComida").value);

      if (!comida || isNaN(calorias)) return;

      const li = document.createElement("li");
      li.textContent = `${comida} - ${calorias} cal`;
      listaCalorias.appendChild(li);

      totalCalorias += calorias;
      totalCaloriasEl.textContent = totalCalorias;
      formCalorias.reset();
    });
  }
});
  