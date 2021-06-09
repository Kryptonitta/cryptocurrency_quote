//VARIABLES
const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const montoSelect = document.querySelector("#monto");
const resultado = document.querySelector("#resultado");

const objetoDeBusqueda = {
	moneda: "",
	criptomoneda: "",
};
//PROMESA
const obtenerCriptomonedas = (criptomonedas) =>
	new Promise((resolve) => {
		resolve(criptomonedas);
	});

//EVENTOS
//-->Cuando el documento esté listo consultá las criptomonedas...

document.addEventListener("DOMContentLoaded", () => {
	consultarCriptomonedas();

	formulario.addEventListener("submit", submitFormulario);
	criptomonedasSelect.addEventListener("change", leerValor);
	monedaSelect.addEventListener("change", leerValor);
});

//FUNCIONES
//-->Personalización cotizador
let name = sessionStorage.getItem("nombre");

saludo();

function saludo() {
	if (name == "" || name == null) {
		PersonalizarWallet();
	} else {
		$(`#nombreBilletera`).replaceWith(`Cotizador virtual de ${name} 💸`);
	}
}

function PersonalizarWallet() {
	$("#nombreBilletera").click(() => {
		let name = prompt("Hola, soy tu cotizador virtual ¿Cuál es tu nombre?");

		if (name == "" || name == null) {
			console.log("El nombre ingresado no es correcto");
		} else {
			$("#nombreBilletera").replaceWith(`Cotizador virtual de ${name} 💸`);
			sessionStorage.setItem("nombre", name);
		}
	});
}

//-->Consultar y obtener criptomonedas desde la api
function consultarCriptomonedas() {
	const url =
		"https://min-api.cryptocompare.com/data/top/mktcapfull?limit=30&tsym=USD";

	fetch(url)
		.then((respuesta) => respuesta.json())
		//Promesa
		.then((resultado) => obtenerCriptomonedas(resultado.Data))
		.then((criptomonedas) => selectCriptomonedas(criptomonedas))
		.catch((error) => console.log(error));
}

//-->Seleccionar criptomoneda
function selectCriptomonedas(criptomonedas) {
	criptomonedas.forEach((cripto) => {
		//Uso un forEach para recorrerlo
		const {FullName, Name} = cripto.CoinInfo;
		const option = document.createElement("option");
		option.value = Name;
		option.textContent = FullName;
		criptomonedasSelect.appendChild(option);
	});
}

//-->Función leer valores
function leerValor(e) {
	objetoDeBusqueda[e.target.name] = e.target.value;
}

//-->Enviar formulario
function submitFormulario(e) {
	e.preventDefault(); //Esto va en todos los formularios
	// Validar
	const {moneda, criptomoneda} = objetoDeBusqueda;
	const monto = montoSelect;

	//Validacion campos vacíos
	if (moneda == "" || criptomoneda == "" || monto.value === "") {
		mostrarAlerta("Todos los campos son obligatorios");
		return;
	}

	//Consultar la api con los resultados
	consultarAPI();
}

//-->Mostrar alerta
function mostrarAlerta(mensaje) {
	const existeError = document.querySelector(".error");
	if (!existeError) {
		//Crear el div
		const divMensaje = document.createElement("div");
		divMensaje.classList.add("error");
		//Mensaje de error
		divMensaje.textContent = mensaje;
		//Agregar al dom
		formulario.appendChild(divMensaje);
		//Timer mensaje
		setTimeout(() => {
			divMensaje.remove();
		}, 5000);
	}
}

//-->Consultar API
function consultarAPI() {
	const {moneda, criptomoneda} = objetoDeBusqueda;

	const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

	//Ocultar la img
	$("img").hide("normal");
	//Mostrar spinner
	mostrarSpinner();

	fetch(url)
		.then((respuesta) => respuesta.json())
		.then((cotizacion) => {
			mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
		});
}

//-->Mostrar cotizacion en el HTML
function mostrarCotizacionHTML(cotizacion) {
	// modificarTitulo();

	//Limpiar HTML
	limpiarHTML();

	const monto = parseFloat(montoSelect.value);
	console.log(monto);
	const {
		PRICE,
		HIGHDAY,
		LOWDAY,
		TOSYMBOL,
		CHANGEPCT24HOUR,
		LASTUPDATE,
	} = cotizacion;
	//Calculando cotización...
	let valorSinUnidad = PRICE.replace(/[ABCDEFGHIJKLMNOPQRSTUVWXYZ$,]/g, "");
	console.log(valorSinUnidad);
	valorMonto = (valorSinUnidad * monto).toFixed(2);
	console.log(valorMonto);
	//Creando elementos...
	const precio = document.createElement("p");
	precio.classList.add("precio");
	precio.innerHTML = `Precio actual: <br><b> ${PRICE} </b>`;

	const equivalencia = document.createElement("p");
	equivalencia.classList.add("precio");
	equivalencia.innerHTML = `El monto ingresado equivale a: <br><b> ${TOSYMBOL} ${valorMonto}</b>`;

	//JQ
	$(`#resultado`).append(
		`<p>Precio más alto del día: <span>${HIGHDAY}</span></p>`
	);

	$(`#resultado`).append(
		`<p>Precio más bajo del día: <span>${LOWDAY}</span></p>`
	);

	$(`#resultado`).append(
		`<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`
	);

	$(`#resultado`).append(
		`<p>Última Actualización: <span>${LASTUPDATE}</span></p>`
	);

	//animación
	$("p").animate({
		width: "500px",
		opacity: "0.9",
	});

	$("p").fadeIn("slow");

	//Append childs
	resultado.appendChild(precio);
	resultado.appendChild(equivalencia);

	//Ocultar la img
	$("img").hide("normal");
}

//-->Limpiar HTML
function limpiarHTML() {
	while (resultado.firstChild) {
		resultado.removeChild(resultado.firstChild);
	}
}

function mostrarSpinner() {
	limpiarHTML();

	const spinner = document.createElement("div");
	spinner.classList.add("spinner");
	spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>`;

	resultado.appendChild(spinner);
}
