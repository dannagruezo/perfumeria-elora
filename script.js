const NUMERO_WHATSAPP = "593999668920";
const NOMBRE_TIENDA = "ÉLORA Perfumería Selecta";
const REDES = {
  instagram: "elora_perfumeria",
  tiktok: "elora_perfumeria1"
};

const CLAVE_CARRITO = "elora-carrito";
const CANTIDAD_MAXIMA = 10;

const productos = [
  {
    id: "bombshell-seduction",
    marca: "Victoria's Secret",
    nombre: "Bombshell Seduction",
    categoria: "femenino",
    descripcion: "Una fragancia femenina, dulce y seductora, con un toque floral y frutal.",
    detalle: "Eau de Parfum de carácter glamuroso y envolvente, presentada en un frasco rosado de corte facetado. Ideal para citas, celebraciones y noches especiales.",
    precio: 8500,
    imagen: "img/bombshell-seduction.svg"
  },
  {
    id: "vs-him-platinum",
    marca: "Victoria's Secret",
    nombre: "VS Him Platinum",
    categoria: "masculino",
    descripcion: "Una fragancia masculina moderna, limpia y sofisticada.",
    detalle: "Un aroma elegante y versátil, con un estilo contemporáneo que funciona tanto en la oficina como en una salida casual. Frasco oscuro con detalle plateado.",
    precio: 7500,
    imagen: "img/vs-him-platinum.svg"
  },
  {
    id: "vs-him-deepwater",
    marca: "Victoria's Secret",
    nombre: "VS Him Deepwater",
    categoria: "masculino",
    descripcion: "Una fragancia fresca y acuática, con un carácter profundo y masculino.",
    detalle: "Inspirada en la frescura del océano, es perfecta para el día a día y los climas cálidos. Se presenta en un frasco azul oscuro con acento plateado.",
    precio: 7500,
    imagen: "img/vs-him-deepwater.svg"
  },
  {
    id: "bare",
    marca: "Victoria's Secret",
    nombre: "Bare",
    categoria: "femenino",
    descripcion: "Una fragancia cálida y suave, con un aire sensual y delicado.",
    detalle: "Eau de Parfum de carácter íntimo y elegante, que se siente como una segunda piel. Su frasco ámbar redondeado con tapa negra la hace un detalle muy especial.",
    precio: 8000,
    imagen: "img/bare.svg"
  }
];

const nombresCategoria = {
  masculino: "Masculino",
  femenino: "Femenino"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const encabezado = $("#encabezado");
const menu = $("#menu");
const btnMenu = $("#btnMenu");
const btnCarrito = $("#btnCarrito");
const contador = $("#contador");
const filtros = $("#filtros");
const grilla = $("#grilla");
const detalle = $("#detalle");
const detalleImagen = $("#detalleImagen");
const detalleMarca = $("#detalleMarca");
const detalleTitulo = $("#detalleTitulo");
const detalleCategoria = $("#detalleCategoria");
const detalleDescripcion = $("#detalleDescripcion");
const detallePrecio = $("#detallePrecio");
const detalleCantidad = $("#detalleCantidad");
const detalleMenos = $("#detalleMenos");
const detalleMas = $("#detalleMas");
const detalleAgregar = $("#detalleAgregar");
const panelCarrito = $("#panelCarrito");
const listaCarrito = $("#listaCarrito");
const carritoVacio = $("#carritoVacio");
const carritoTotal = $("#carritoTotal");
const btnFinalizar = $("#btnFinalizar");
const aviso = $("#aviso");
const formulario = $("#formulario");

let filtroActual = "todos";
let productoActual = null;
let cantidadDetalle = 1;
let temporizadorAviso = null;
let carrito = cargarCarrito();

function buscarProducto(id) {
  return productos.find((producto) => producto.id === id);
}

function formatearPrecio(centavos) {
  return (centavos / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
  });
}

function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function crearImagen(producto, clase) {
  const imagen = crear("img", clase);
  imagen.src = producto.imagen;
  imagen.alt = `Frasco de ${producto.marca} ${producto.nombre}`;
  imagen.addEventListener("error", () => {
    imagen.src = "img/respaldo.svg";
  }, { once: true });
  return imagen;
}

function crearBoton(clase, texto, accion, id) {
  const boton = crear("button", clase, texto);
  boton.type = "button";
  boton.dataset.accion = accion;
  boton.dataset.id = id;
  return boton;
}

function avisar(texto) {
  aviso.textContent = texto;
  if (!aviso.matches(":popover-open")) aviso.showPopover();
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.hidePopover(), 2800);
}

function cargarCarrito() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));
    if (!Array.isArray(guardado)) return [];
    const resultado = [];
    guardado.forEach((item) => {
      const valido = item
        && buscarProducto(item.id)
        && Number.isInteger(item.cantidad)
        && item.cantidad >= 1
        && item.cantidad <= CANTIDAD_MAXIMA
        && !resultado.some((existente) => existente.id === item.id);
      if (valido) resultado.push({ id: item.id, cantidad: item.cantidad });
    });
    return resultado;
  } catch {
    return [];
  }
}

function guardarCarrito() {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch {
    return;
  }
}

function totalUnidades() {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0);
}

function totalPrecio() {
  return carrito.reduce((suma, item) => suma + buscarProducto(item.id).precio * item.cantidad, 0);
}

function pintarProductos() {
  grilla.replaceChildren();
  const lista = filtroActual === "todos"
    ? productos
    : productos.filter((producto) => producto.categoria === filtroActual);

  lista.forEach((producto) => {
    const tarjeta = crear("article", "tarjeta");

    const foto = crear("div", "tarjeta__foto");
    foto.append(crearImagen(producto));

    const cuerpo = crear("div", "tarjeta__cuerpo");
    const botones = crear("div", "tarjeta__botones");
    botones.append(
      crearBoton("boton boton--linea boton--chico", "Ver detalles", "detalle", producto.id),
      crearBoton("boton boton--oro boton--chico", "Agregar al carrito", "agregar", producto.id)
    );

    cuerpo.append(
      crear("p", "tarjeta__marca", producto.marca),
      crear("h3", "tarjeta__nombre", producto.nombre),
      crear("p", "tarjeta__categoria", nombresCategoria[producto.categoria]),
      crear("p", "tarjeta__desc", producto.descripcion),
      crear("p", "tarjeta__precio", formatearPrecio(producto.precio)),
      botones
    );

    tarjeta.append(foto, cuerpo);
    grilla.append(tarjeta);
  });
}

function pintarCarrito() {
  listaCarrito.replaceChildren();
  const vacio = carrito.length === 0;
  listaCarrito.hidden = vacio;
  carritoVacio.hidden = !vacio;
  btnFinalizar.disabled = vacio;

  carrito.forEach((item) => {
    const producto = buscarProducto(item.id);
    const fila = crear("li", "item");
    fila.dataset.id = producto.id;

    const info = crear("div", "item__info");
    const cantidad = crear("div", "cantidad");
    const menos = crearBoton("", "−", "menos", producto.id);
    menos.setAttribute("aria-label", `Disminuir cantidad de ${producto.nombre}`);
    menos.disabled = item.cantidad <= 1;
    const mas = crearBoton("", "+", "mas", producto.id);
    mas.setAttribute("aria-label", `Aumentar cantidad de ${producto.nombre}`);
    mas.disabled = item.cantidad >= CANTIDAD_MAXIMA;
    cantidad.append(menos, crear("output", "", item.cantidad), mas);

    info.append(
      crear("p", "item__nombre", `${producto.marca} ${producto.nombre}`),
      crear("p", "item__precio", `${formatearPrecio(producto.precio)} c/u`),
      cantidad
    );

    const lado = crear("div", "item__lado");
    lado.append(
      crear("p", "item__subtotal", formatearPrecio(producto.precio * item.cantidad)),
      crearBoton("item__quitar", "Quitar", "quitar", producto.id)
    );

    fila.append(crearImagen(producto, "item__img"), info, lado);
    listaCarrito.append(fila);
  });

  carritoTotal.textContent = formatearPrecio(totalPrecio());
}

function pintarContador() {
  const unidades = totalUnidades();
  contador.textContent = unidades;
  contador.hidden = unidades === 0;
  btnCarrito.setAttribute("aria-label", `Abrir carrito, ${unidades} productos`);
}

function actualizarCarrito() {
  guardarCarrito();
  pintarCarrito();
  pintarContador();
}

function agregarAlCarrito(id, cantidad) {
  const producto = buscarProducto(id);
  if (!producto) return;
  const item = carrito.find((existente) => existente.id === id);
  if (item) {
    item.cantidad = Math.min(CANTIDAD_MAXIMA, item.cantidad + cantidad);
  } else {
    carrito.push({ id, cantidad });
  }
  actualizarCarrito();
  avisar(`${producto.marca} ${producto.nombre} se añadió al carrito`);
}

function cambiarCantidad(id, cambio) {
  const item = carrito.find((existente) => existente.id === id);
  if (!item) return;
  const nueva = item.cantidad + cambio;
  if (nueva < 1 || nueva > CANTIDAD_MAXIMA) return;
  item.cantidad = nueva;
  actualizarCarrito();
}

function quitarDelCarrito(id) {
  carrito = carrito.filter((item) => item.id !== id);
  actualizarCarrito();
}

function pintarCantidadDetalle() {
  detalleCantidad.textContent = cantidadDetalle;
  detalleMenos.disabled = cantidadDetalle <= 1;
  detalleMas.disabled = cantidadDetalle >= CANTIDAD_MAXIMA;
}

function abrirDetalle(id) {
  const producto = buscarProducto(id);
  if (!producto) return;
  productoActual = producto;
  cantidadDetalle = 1;
  detalleImagen.src = producto.imagen;
  detalleImagen.alt = `Frasco de ${producto.marca} ${producto.nombre}`;
  detalleMarca.textContent = producto.marca;
  detalleTitulo.textContent = producto.nombre;
  detalleCategoria.textContent = `Fragancia ${nombresCategoria[producto.categoria].toLowerCase()}`;
  detalleDescripcion.textContent = `${producto.descripcion} ${producto.detalle}`;
  detallePrecio.textContent = formatearPrecio(producto.precio);
  pintarCantidadDetalle();
  detalle.showModal();
}

function abrirWhatsApp(texto) {
  if (!/^\d{10,15}$/.test(NUMERO_WHATSAPP)) {
    avisar("El pedido por WhatsApp todavía no está disponible");
    return false;
  }
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank", "noopener");
  return true;
}

function finalizarPedido() {
  if (carrito.length === 0) {
    avisar("Tu carrito está vacío");
    return;
  }
  const lineas = [`Hola, quiero hacer este pedido en ${NOMBRE_TIENDA}:`, ""];
  carrito.forEach((item) => {
    const producto = buscarProducto(item.id);
    lineas.push(`${producto.marca} ${producto.nombre}`);
    lineas.push(`Cantidad: ${item.cantidad} x ${formatearPrecio(producto.precio)} = ${formatearPrecio(producto.precio * item.cantidad)}`);
    lineas.push("");
  });
  lineas.push(`Total: ${formatearPrecio(totalPrecio())}`);
  abrirWhatsApp(lineas.join("\n"));
}

function mostrarError(campo, mensaje) {
  const contenedor = campo.closest(".campo");
  contenedor.classList.toggle("invalido", mensaje !== "");
  contenedor.querySelector(".campo__error").textContent = mensaje;
  return mensaje === "";
}

function validarFormulario() {
  const nombre = formulario.nombre;
  const correo = formulario.correo;
  const mensaje = formulario.mensaje;
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim());

  const resultados = [
    mostrarError(nombre, nombre.value.trim().length < 2 ? "Escribe tu nombre" : ""),
    mostrarError(correo, correoValido ? "" : "Escribe un correo válido"),
    mostrarError(mensaje, mensaje.value.trim().length < 10 ? "Cuéntanos un poco más (mínimo 10 caracteres)" : "")
  ];
  return resultados.every(Boolean);
}

function enviarConsulta(evento) {
  evento.preventDefault();
  if (!validarFormulario()) return;
  const texto = [
    `Consulta desde la web de ${NOMBRE_TIENDA}`,
    "",
    `Nombre: ${formulario.nombre.value.trim()}`,
    `Correo: ${formulario.correo.value.trim()}`,
    `Mensaje: ${formulario.mensaje.value.trim()}`
  ].join("\n");
  if (abrirWhatsApp(texto)) {
    formulario.reset();
    avisar("Revisa tu consulta en WhatsApp y envíala");
  }
}

function configurarRedes() {
  $$("[data-red]").forEach((enlace) => {
    const url = REDES[enlace.dataset.red];
    if (url) {
      enlace.href = url;
      enlace.target = "_blank";
      enlace.rel = "noopener";
    } else {
      enlace.addEventListener("click", (evento) => {
        evento.preventDefault();
        avisar("Este enlace estará disponible pronto");
      });
    }
  });
}

function revelarSecciones() {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.remove("oculto");
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  $$("[data-reveal]").forEach((elemento) => {
    if (elemento.getBoundingClientRect().top > window.innerHeight) {
      elemento.classList.add("oculto");
      observador.observe(elemento);
    }
  });
}

function cerrarMenu() {
  menu.classList.remove("abierto");
  btnMenu.setAttribute("aria-expanded", "false");
  btnMenu.setAttribute("aria-label", "Abrir menú");
}

btnMenu.addEventListener("click", () => {
  const abierto = menu.classList.toggle("abierto");
  btnMenu.setAttribute("aria-expanded", abierto);
  btnMenu.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
});

menu.addEventListener("click", (evento) => {
  if (evento.target.closest("a")) cerrarMenu();
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") cerrarMenu();
});

window.addEventListener("scroll", () => {
  encabezado.classList.toggle("scroll", window.scrollY > 10);
}, { passive: true });

filtros.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-filtro]");
  if (!boton) return;
  filtroActual = boton.dataset.filtro;
  filtros.querySelectorAll("[data-filtro]").forEach((otro) => {
    const activo = otro === boton;
    otro.classList.toggle("activo", activo);
    otro.setAttribute("aria-pressed", activo);
  });
  pintarProductos();
});

grilla.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion]");
  if (!boton) return;
  if (boton.dataset.accion === "detalle") abrirDetalle(boton.dataset.id);
  if (boton.dataset.accion === "agregar") agregarAlCarrito(boton.dataset.id, 1);
});

detalleMenos.addEventListener("click", () => {
  cantidadDetalle = Math.max(1, cantidadDetalle - 1);
  pintarCantidadDetalle();
});

detalleMas.addEventListener("click", () => {
  cantidadDetalle = Math.min(CANTIDAD_MAXIMA, cantidadDetalle + 1);
  pintarCantidadDetalle();
});

detalleAgregar.addEventListener("click", () => {
  agregarAlCarrito(productoActual.id, cantidadDetalle);
  detalle.close();
});

btnCarrito.addEventListener("click", () => panelCarrito.showModal());

listaCarrito.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion]");
  if (!boton) return;
  const { accion, id } = boton.dataset;
  if (accion === "mas") cambiarCantidad(id, 1);
  if (accion === "menos") cambiarCantidad(id, -1);
  if (accion === "quitar") quitarDelCarrito(id);
  listaCarrito.querySelector(`[data-id="${id}"] [data-accion="${accion}"]:not(:disabled)`)?.focus();
});

btnFinalizar.addEventListener("click", finalizarPedido);

$("#btnWhatsapp").addEventListener("click", () => {
  abrirWhatsApp(`Hola, quiero información sobre las fragancias de ${NOMBRE_TIENDA}.`);
});

formulario.addEventListener("submit", enviarConsulta);

document.addEventListener("click", (evento) => {
  const cerrar = evento.target.closest("[data-cerrar]");
  if (cerrar) cerrar.closest("dialog").close();
  if (evento.target instanceof HTMLDialogElement) evento.target.close();
});

$("#anio").textContent = new Date().getFullYear();

pintarProductos();
actualizarCarrito();
configurarRedes();
revelarSecciones();
