(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var movimientoReducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var cabecera = document.getElementById("cab");
  var ultimoScroll = 0;

  function encabezadoPegado() {
    if (window.scrollY > 40) {
      cabecera.classList.add("cab--pegado");
    } else {
      cabecera.classList.remove("cab--pegado");
    }
  }

  window.addEventListener("scroll", encabezadoPegado, { passive: true });
  encabezadoPegado();

  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  burger.addEventListener("click", function () {
    var abierto = nav.classList.toggle("nav--abierto");
    burger.classList.toggle("burger--activo", abierto);
    burger.setAttribute("aria-expanded", abierto ? "true" : "false");
    burger.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });

  var enlacesNav = nav.querySelectorAll("a");
  enlacesNav.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      nav.classList.remove("nav--abierto");
      burger.classList.remove("burger--activo");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  var observar = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("reveal--visible");
          observar.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  var revelados = document.querySelectorAll(".reveal");
  revelados.forEach(function (elemento) {
    observar.observe(elemento);
  });

  function animarContador(elemento, objetivo, duracion) {
    var inicio = null;

    function paso(marca) {
      if (!inicio) inicio = marca;
      var progreso = Math.min((marca - inicio) / duracion, 1);
      var suavizado = 1 - Math.pow(1 - progreso, 3);
      var valor = Math.round(suavizado * objetivo);
      elemento.textContent = String(valor);
      if (progreso < 1) {
        window.requestAnimationFrame(paso);
      }
    }

    window.requestAnimationFrame(paso);
  }

  var observarCuentas = new IntersectionObserver(
    function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          var elemento = entrada.target;
          var objetivo = parseInt(elemento.getAttribute("data-objetivo"), 10) || 0;
          animarContador(elemento, objetivo, movimientoReducido ? 1 : 1100);
          observarCuentas.unobserve(elemento);
        }
      });
    },
    { threshold: 0.6 }
  );

  var cuentas = document.querySelectorAll(".cuenta");
  cuentas.forEach(function (elemento) {
    observarCuentas.observe(elemento);
  });

  var mallaHero = document.getElementById("heroGrid");
  var hero = document.getElementById("inicio");
  var solicitando = false;
  var marcoActual = 0;

  function paralaje() {
    if (movimientoReducido || !mallaHero || !hero) return;
    var rect = hero.getBoundingClientRect();
    var avance = Math.min(Math.max(-rect.top, 0), rect.height);
    var offset = avance * 0.18;
    mallaHero.style.transform = "translateY(" + offset + "px)";
  }

  function enCola() {
    if (solicitando) return;
    solicitando = true;
    window.requestAnimationFrame(function () {
      paralaje();
      solicitando = false;
    });
  }

  window.addEventListener("scroll", enCola, { passive: true });

  var formulario = document.getElementById("cotizacion-form");
  var numeroWhatsApp = "18299127544";

  if (formulario) {
    var estadoDiv = document.createElement("p");
    estadoDiv.className = "form__estado";
    estadoDiv.setAttribute("role", "status");
    formulario.appendChild(estadoDiv);

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      estadoDiv.classList.remove("form__estado--visible", "form__estado--ok", "form__estado--error");

      var nombre = formulario.nombre.value.trim();
      var telefono = formulario.telefono.value.trim();
      var servicio = formulario.servicio.value;
      var mensaje = formulario.mensaje.value.trim();

      if (!nombre || !telefono || !servicio) {
        estadoDiv.textContent = "Completa tu nombre, tu teléfono y el servicio antes de enviar.";
        estadoDiv.classList.add("form__estado--visible", "form__estado--error");
        return;
      }

      var lineas = [
        "Hola Electricista S.A. Soluciones, quiero cotizar un servicio.",
        "",
        "Nombre: " + nombre,
        "Teléfono: " + telefono,
        "Servicio: " + servicio
      ];

      if (mensaje) {
        lineas.push("Detalle: " + mensaje);
      }

      lineas.push("", "Enviado desde la página web.");

      var url =
        "https://wa.me/" +
        numeroWhatsApp +
        "?text=" +
        encodeURIComponent(lineas.join("\n"));

      estadoDiv.textContent = "Se abrió WhatsApp con tu solicitud lista para enviar.";
      estadoDiv.classList.add("form__estado--visible", "form__estado--ok");

      window.open(url, "_blank", "noopener");
    });
  }
})();
