function calcularCotizacion() {
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const meses = document.querySelector('input[name="mensualidades"]:checked').value;
    const buro = document.getElementById('buro').value;
    if (cantidad < 50000) {

        Swal.fire({
            position: 'top-end',
            icon: 'warning',
            title: 'La cantidad minima es a partir de $ 50,000',
            showConfirmButton: false,
            timer: 2500
        })
        return;
    }

    let interes = 0;
    if (buro === 'bueno') {
        interes = 0.15; // 15% de interés
    } else if (buro === 'regular') {
        interes = 0.20; // 20% de interés
    } else if (buro === 'malo') {
        interes = 0.25; // 25% de interés
    }

    // Cálculo de la mensualidad
    const tasaInteres = cantidad * interes;
    const totalPrestamo = cantidad + tasaInteres;
    const mensualidad = totalPrestamo / meses;

    // Mostrar resultado
    const resultado = document.getElementById('resultado-cotizacion');
    resultado.innerHTML = `A ${meses} meses la mesualidad a pagar es de: ${mensualidad.toFixed(2)} pesos.`;
}

function calcularMensualidad() {
    const tipoCredito = parseFloat(document.getElementById("tipoCredito").value);
    const montoPrestamo = parseFloat(document.getElementById("montoPrestamo").value);
    const plazoRadios = document.getElementsByName("plazo");
    let plazoMeses = 0;

    // Obtener el valor del plazo seleccionado
    for (let i = 0; i < plazoRadios.length; i++) {
        if (plazoRadios[i].checked) {
            plazoMeses = parseFloat(plazoRadios[i].value);
            break;
        }
    }

    if (montoPrestamo < 50000) {
        alert("El monto del préstamo debe ser de al menos $50,000.");
        return;
    }

    const mensualidad = (montoPrestamo * tipoCredito) / plazoMeses;

    document.getElementById("resultado").textContent = `Monto de la mensualidad: $${mensualidad.toFixed(2)}`;
}




function confirmarEliminacion(e) {
    e.preventDefault();
    var url = e.currentTarget.getAttribute('href');
    Swal.fire({
        title: 'Estás seguro?',
        text: "Realmente quieres eliminar este registro!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.value) {
            window.location.href = url;
        }
    })
}


// Contenido de script.js
$(document).ready(function () {
    const imageList = document.getElementById("imageList");
    const imagenPreview = document.getElementById("imagenPreview");
    const fileInput = document.getElementById("imagen");

    fileInput.addEventListener("change", (event) => {
        const files = event.target.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.className = "preview-image";
                img.alt = file.name;
                imagenPreview.appendChild(img);
                imageList.value += `${file.name}\n`;
            };
            reader.readAsDataURL(file);
        }
    });

    imagenPreview.addEventListener("click", (event) => {
        if (event.target.className === "preview-image") {
            imageList.value = imageList.value.replace(`${event.target.alt}\n`, "");
            event.target.remove();
        }
    });
});



function mostrarImagen(element) {
    var imagen = element.getAttribute('src');
    var mainImage = document.getElementById('mainImage');
    mainImage.innerHTML = '<img src="' + imagen + '" class="img-fluid">';

    // Resaltar la miniatura seleccionada
    var thumbnails = document.getElementsByClassName('thumbnail');
    for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].classList.remove('active');
    }
    element.classList.add('active');
}






$(document).ready(function () {
    console.log('Script ejecutado correctamente');
    $('#btnOtroModelo').on('click', function () {
        $('#modelo_auto').attr('size', '{{ catalogo|length }}'); // Mostrar todos los elementos del select
    });
});
// scripts.js
function toggleDescripcion(id) {
    var descripcion = document.getElementById('descripcion_' + id);
    descripcion.innerHTML = moto.descripcion;  // Asegúrate de tener acceso a 'moto.descripcion' en el contexto JS
}

// script.js

// Lista para almacenar rutas de imágenes seleccionadas
const selectedImagePaths = [];

function handleImageSelection(event) {
    const fileList = event.target.files;
    const imageListTextarea = document.getElementById("imageList");
    const imagenPreview = document.getElementById("imagenPreview");

    // Iterar sobre los archivos seleccionados
    Array.from(fileList).forEach(file => {
        // Mostrar la imagen en la vista previa (opcional)
        const imgElement = document.createElement("img");
        imgElement.src = URL.createObjectURL(file);
        imgElement.style.width = "100px"; // Puedes ajustar el tamaño según tus necesidades
        imagenPreview.appendChild(imgElement);

        // Agregar la ruta de la imagen a la lista
        selectedImagePaths.push(URL.createObjectURL(file));
    });

    // Actualizar el contenido del campo de texto oculto con rutas acumuladas
    imageListTextarea.value = selectedImagePaths.join('\n');
}

// Otra función para limpiar la lista si es necesario
function clearImageList() {
    selectedImagePaths.length = 0;
}



function filtrarPorMarca() {
    var seleccion = document.getElementById("marcaFiltro").value;
    var tarjetas = document.querySelectorAll('.card');

    tarjetas.forEach(function (tarjeta) {
        tarjeta.style.display = "none";  // Oculta todas las tarjetas
    });

    if (seleccion !== "") {
        var tarjetasFiltradas = document.querySelectorAll('.marca-' + seleccion);
        tarjetasFiltradas.forEach(function (tarjeta) {
            tarjeta.style.display = "block";  // Muestra solo las tarjetas de la marca seleccionada
        });
    } else {
        tarjetas.forEach(function (tarjeta) {
            tarjeta.style.display = "block";  // Muestra todas las tarjetas si no hay selección
        });
    }
}
function filtrarAutos() {
    var selectedMarca = document.getElementById("marcaFiltro").value.toLowerCase();
    var selectedAno = document.getElementById("anoFiltro").value.toLowerCase();
    var selectedCombustible = document.getElementById("combustibleFiltro").value.toLowerCase();
    var selectedTransmision = document.getElementById("transmisionFiltro").value.toLowerCase();
    var busqueda = document.getElementById("busquedaRapida").value.toLowerCase();
    var cars = document.querySelectorAll(".card");

    var mensajeNoEncontrado = document.getElementById("mensajeNoEncontrado");
    var encontrados = false; // Variable para rastrear si se encontraron registros

    cars.forEach(function (car) {
        var marca = car.getAttribute("data-marca");
        var ano = car.getAttribute("data-ano");
        var combustible = car.querySelector(".combustible").textContent.toLowerCase();
        var transmision = car.getAttribute("data-transmision").toLowerCase(); // Obtener el tipo de transmisión
        var busquedaTarjeta = car.getAttribute("data-busqueda").toLowerCase();

        var verTodosCondicion = selectedMarca === "" && selectedAno === "" && selectedCombustible === "" && selectedTransmision === ""
        && busqueda === "";

        var marcaCondicion = verTodosCondicion || selectedMarca === "" || selectedMarca === marca;
        var anoCondicion = verTodosCondicion || selectedAno === "" || selectedAno === ano;
        var combustibleCondicion = verTodosCondicion || selectedCombustible === "" || selectedCombustible === combustible;
        var transmisionCondicion = verTodosCondicion || selectedTransmision === "" || selectedTransmision === transmision;
        var busquedaCondicion = verTodosCondicion || busquedaTarjeta.includes(busqueda);

        if (marcaCondicion && anoCondicion && combustibleCondicion && transmisionCondicion && busquedaCondicion) {
            car.style.display = "block";
            encontrados = true; // Se encontró al menos un registro
        } else {
            car.style.display = "none";
        }
    });

    // Mostrar u ocultar el mensaje de "No se encontraron registros"
    if (!encontrados) {
        mensajeNoEncontrado.style.display = "block";
    } else {
        mensajeNoEncontrado.style.display = "none";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    var tarjetas = document.querySelectorAll(".card");
    var tarjetasPorPagina = 5;
    var controlesPaginacion = document.getElementById("pagination");
    var inputBusqueda = document.getElementById("busquedaRapida");
    var currentPage = 1;

    // Función para mostrar la página actual considerando la búsqueda y el filtrado
    function mostrarPagina(pagina) {
        var inicio = (pagina - 1) * tarjetasPorPagina;
        var fin = inicio + tarjetasPorPagina;

        // Oculta todas las tarjetas
        tarjetas.forEach(function (tarjeta) {
            tarjeta.style.display = "none";
        });

        // Filtra las tarjetas según la búsqueda y el filtrado
        var tarjetasFiltradas = Array.from(tarjetas).filter(function (tarjeta, index) {
            var marca = tarjeta.getAttribute("data-marca");
            var ano = tarjeta.getAttribute("data-ano");
            var combustible = tarjeta.querySelector(".combustible").textContent.toLowerCase();
            var transmision = tarjeta.getAttribute("data-transmision").toLowerCase();
            var busquedaTarjeta = tarjeta.getAttribute("data-busqueda").toLowerCase();

            var verTodosCondicion = (
                inputBusqueda.value === "" &&
                document.getElementById("marcaFiltro").value === "" &&
                document.getElementById("anoFiltro").value === "" &&
                document.getElementById("combustibleFiltro").value === "" &&
                document.getElementById("transmisionFiltro").value === ""
            );

            var marcaCondicion = verTodosCondicion || document.getElementById("marcaFiltro").value === "" || document.getElementById("marcaFiltro").value === marca;
            var anoCondicion = verTodosCondicion || document.getElementById("anoFiltro").value === "" || document.getElementById("anoFiltro").value === ano;
            var combustibleCondicion = verTodosCondicion || document.getElementById("combustibleFiltro").value === "" || document.getElementById("combustibleFiltro").value === combustible;
            var transmisionCondicion = verTodosCondicion || document.getElementById("transmisionFiltro").value === "" || document.getElementById("transmisionFiltro").value === transmision;
            var busquedaCondicion = verTodosCondicion || busquedaTarjeta.includes(inputBusqueda.value.toLowerCase());

            return marcaCondicion && anoCondicion && combustibleCondicion && transmisionCondicion && busquedaCondicion;
        });

        // Muestra solo las tarjetas de la página actual
        tarjetasFiltradas.slice(inicio, fin).forEach(function (tarjeta) {
            tarjeta.style.display = "block";
        });

        // Actualiza la página actual
        currentPage = pagina;
        // Actualiza la visualización de los botones de paginación
        actualizarBotonesPaginacion();
    }

    function agregarControlesPaginacion() {
        // Limpia los controles de paginación existentes
        controlesPaginacion.innerHTML = '';

        // Calcula el nuevo total de páginas después de la búsqueda y el filtrado
        var totalPaginasDespuesDeFiltrado = Math.ceil(
            Array.from(tarjetas).filter(function (tarjeta) {
                var marca = tarjeta.getAttribute("data-marca");
                var ano = tarjeta.getAttribute("data-ano");
                var combustible = tarjeta.querySelector(".combustible").textContent.toLowerCase();
                var transmision = tarjeta.getAttribute("data-transmision").toLowerCase();
                var busquedaTarjeta = tarjeta.getAttribute("data-busqueda").toLowerCase();

                var verTodosCondicion = (
                    inputBusqueda.value === "" &&
                    document.getElementById("marcaFiltro").value === "" &&
                    document.getElementById("anoFiltro").value === "" &&
                    document.getElementById("combustibleFiltro").value === "" &&
                    document.getElementById("transmisionFiltro").value === ""
                );

                var marcaCondicion = verTodosCondicion || document.getElementById("marcaFiltro").value === "" || document.getElementById("marcaFiltro").value === marca;
                var anoCondicion = verTodosCondicion || document.getElementById("anoFiltro").value === "" || document.getElementById("anoFiltro").value === ano;
                var combustibleCondicion = verTodosCondicion || document.getElementById("combustibleFiltro").value === "" || 
                document.getElementById("combustibleFiltro").value === combustible;
                var transmisionCondicion = verTodosCondicion || document.getElementById("transmisionFiltro").value === "" ||
                 document.getElementById("transmisionFiltro").value === transmision;
                var busquedaCondicion = verTodosCondicion || busquedaTarjeta.includes(inputBusqueda.value.toLowerCase());

                return marcaCondicion && anoCondicion && combustibleCondicion && transmisionCondicion && busquedaCondicion;
            }).length / tarjetasPorPagina
        );

        // Crea botones de paginación
        for (var i = 1; i <= totalPaginasDespuesDeFiltrado; i++) {
            var boton = document.createElement("button");
            boton.innerText = i;
            boton.addEventListener("click", function () {
                mostrarPagina(this.innerText);
            });

            var li = document.createElement("li");
            li.appendChild(boton);
            var ul = document.getElementById("pagination");
            ul.appendChild(li);
        }
    }



    // Función para actualizar la visualización de los botones de paginación
    function actualizarBotonesPaginacion() {
        // Obtiene todos los botones de paginación
        var botonesPaginacion = controlesPaginacion.getElementsByTagName("button");

        // Recorre todos los botones de paginación y marca el actual como activo
        for (var i = 0; i < botonesPaginacion.length; i++) {
            var numeroPagina = parseInt(botonesPaginacion[i].innerText);
            if (numeroPagina === currentPage) {
                botonesPaginacion[i].classList.add("active");
            } else {
                botonesPaginacion[i].classList.remove("active");
            }
        }
    }

    // Función para avanzar a la siguiente página
    function avanzarPagina() {
        if (currentPage < Math.ceil(tarjetas.length / tarjetasPorPagina)) {
            mostrarPagina(currentPage + 1);
        }
    }

    // Función para retroceder a la página anterior
    function retrocederPagina() {
        if (currentPage > 1) {
            mostrarPagina(currentPage - 1);
        }
    }

    // Eventos para avanzar y retroceder
    document.getElementById("nextBtn").addEventListener("click", function () {
        avanzarPagina();
    });

    document.getElementById("previousBtn").addEventListener("click", function () {
        retrocederPagina();
    });

    // Llama a las funciones al cargar la página
    mostrarPagina(1);
    agregarControlesPaginacion();
});



function agregarControlesPaginacion() {
    var paginationContainer = document.getElementById("paginationContainer");
    paginationContainer.innerHTML = ''; // Limpiar el contenido anterior

    // Calcula el nuevo total de páginas después de la búsqueda y el filtrado
    var totalPaginasDespuesDeFiltrado = Math.ceil(
        Array.from(tarjetas).filter(function (tarjeta) {
            // ... (tu lógica de filtrado aquí)
        }).length / tarjetasPorPagina
    );

    // Crea botones de paginación
    for (var i = 1; i <= totalPaginasDespuesDeFiltrado; i++) {
        var boton = document.createElement("button");
        boton.innerText = i;
        boton.addEventListener("click", function () {
            mostrarPagina(this.innerText);
        });

        paginationContainer.appendChild(boton);
    }
}

// Función para filtrar los autos basados en los criterios de búsqueda
function filtrarMotos() {
    // Obtener los valores de los filtros
    var marca = document.getElementById('marcaFiltro').value.toLowerCase();
    var ano = document.getElementById('anoFiltro').value.toLowerCase();
    var combustible = document.getElementById('combustibleFiltro').value.toLowerCase();
    var transmision = document.getElementById('transmisionFiltro').value.toLowerCase();
    var busquedaRapida = document.getElementById('busquedaRapida').value.toLowerCase();

    // Obtener todas las tarjetas de autos
    var tarjetas = document.getElementsByClassName('card');

    // Iterar sobre las tarjetas y mostrar/ocultar según los criterios de búsqueda
    for (var i = 0; i < tarjetas.length; i++) {
        var tarjeta = tarjetas[i];
        var marcaTarjeta = tarjeta.querySelector('.titulo').innerText.toLowerCase();
        var anoTarjeta = tarjeta.querySelector('.year-badge span').innerText.toLowerCase();
        var combustibleTarjeta = tarjeta.querySelector('.fa-gas-pump').nextSibling.nodeValue.trim().toLowerCase();
        var transmisionTarjeta = tarjeta.querySelector('.fa-gauge').nextSibling.nodeValue.trim().toLowerCase();
        var descripcionTarjeta = tarjeta.querySelector('.card-text').innerText.toLowerCase();

        var cumpleFiltros = true;

        // Aplicar filtros
        if (marca && !marcaTarjeta.includes(marca)) {
            cumpleFiltros = false;
        }
        if (ano && !anoTarjeta.includes(ano)) {
            cumpleFiltros = false;
        }
        if (combustible && !combustibleTarjeta.includes(combustible)) {
            cumpleFiltros = false;
        }
        if (transmision && !transmisionTarjeta.includes(transmision)) {
            cumpleFiltros = false;
        }
        if (busquedaRapida && !descripcionTarjeta.includes(busquedaRapida)) {
            cumpleFiltros = false;
        }

        // Mostrar u ocultar la tarjeta según los filtros
        tarjeta.style.display = cumpleFiltros ? 'block' : 'none';
    }
}

// Asociar la función de filtrado a los eventos de cambio en los elementos de filtro
document.getElementById('marcaFiltro').addEventListener('change', filtrarMotos);
document.getElementById('anoFiltro').addEventListener('change', filtrMotos);
document.getElementById('combustibleFiltro').addEventListener('change', filtrMotos);
document.getElementById('transmisionFiltro').addEventListener('change', filtrMotos);
document.getElementById('busquedaRapida').addEventListener('input', filtrMotos);

