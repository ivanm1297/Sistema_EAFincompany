document.addEventListener('DOMContentLoaded', function () {
    const inputBusqueda = document.getElementById('busqueda_automatica');
    const tablaRegistros = document.getElementById('miTabla').querySelectorAll('tbody tr');
    const mensajeNoEncontrado = document.getElementById('mensajeNoEncontrado');
    const pagination = document.getElementById('pagination');

    let currentPage = 1;
    let previousPage = 1;
    const recordsPerPage = 4;
    let filteredRows = [];

    function displayFilteredRecords(startIndex, endIndex) {
        for (let i = 0; i < filteredRows.length; i++) {
            filteredRows[i].style.display = i >= startIndex && i < endIndex ? '' : 'none';
        }
    }

    function updateFilteredPagination() {
        const pageCount = Math.ceil(filteredRows.length / recordsPerPage);

        pagination.innerHTML = '';

        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');
            if (i === currentPage) {
                li.classList.add('active');
            }
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', function (event) {
                currentPage = parseInt(event.target.text);
                updateFilteredPagination();
            });

            pagination.appendChild(li);
        }

        const previousBtn = document.getElementById('previousBtn');
        const nextBtn = document.getElementById('nextBtn');

        previousBtn.addEventListener('click', goToPreviousFilteredPage);
        nextBtn.addEventListener('click', goToNextFilteredPage);

        previousBtn.style.display = currentPage > 1 ? '' : 'none';
        nextBtn.style.display = currentPage < pageCount ? '' : 'none';

        displayFilteredRecords((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
    }

    function goToPreviousFilteredPage() {
        if (currentPage > 1) {
            currentPage--;
            updateFilteredPagination();
        }
    }

    function goToNextFilteredPage() {
        const pageCount = Math.ceil(filteredRows.length / recordsPerPage);

        if (currentPage < pageCount) {
            currentPage++;
            updateFilteredPagination();
        }
    }

    function filterRecords() {
        const textoBusqueda = inputBusqueda.value.toLowerCase();
        filteredRows = [];

        for (let i = 0; i < tablaRegistros.length; i++) {
            const registro = tablaRegistros[i];
            const modelo = registro.cells[0].textContent.toLowerCase();

            if (modelo.includes(textoBusqueda)) {
                filteredRows.push(registro);
            } else {
                registro.style.display = 'none';
            }
        }

        if (textoBusqueda !== '') {
            previousPage = currentPage;
            currentPage = 1;
        } else {
            currentPage = previousPage;
        }

        history.replaceState({ page: currentPage }, null, `?page=${currentPage}`);

        updateFilteredPagination();
    }

    inputBusqueda.addEventListener('input', function () {
        filterRecords();
    });

    function displayRecords(startIndex, endIndex) {
        for (let i = 0; i < tablaRegistros.length; i++) {
            tablaRegistros[i].style.display = i >= startIndex && i < endIndex ? '' : 'none';
        }
    }

    function setupPagination() {
        const pageCount = Math.ceil(tablaRegistros.length / recordsPerPage);

        pagination.innerHTML = '';

        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');
            if (i === currentPage) {
                li.classList.add('active');
            }
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', function (event) {
                currentPage = parseInt(event.target.text);
                updatePagination();
            });

            pagination.appendChild(li);
        }

        const previousBtn = document.getElementById('previousBtn');
        const nextBtn = document.getElementById('nextBtn');

        previousBtn.addEventListener('click', goToPreviousPage);
        nextBtn.addEventListener('click', goToNextPage);

        previousBtn.style.display = currentPage > 1 ? '' : 'none';
        nextBtn.style.display = currentPage < pageCount ? '' : 'none';

        displayRecords((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
    }

    function updatePagination() {
        const pageCount = Math.ceil(tablaRegistros.length / recordsPerPage);

        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;

        displayRecords(startIndex, endIndex);
        updatePaginationStyles();

        const previousBtn = document.getElementById('previousBtn');
        const nextBtn = document.getElementById('nextBtn');

        previousBtn.style.display = currentPage > 1 ? '' : 'none';
        nextBtn.style.display = currentPage < pageCount ? '' : 'none';
    }

    function updatePaginationStyles() {
        const items = pagination.getElementsByClassName('page-item');

        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
        }

        items[currentPage - 1].classList.add('active');
    }

    function goToPreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    }

    function goToNextPage() {
        const pageCount = Math.ceil(tablaRegistros.length / recordsPerPage);

        if (currentPage < pageCount) {
            currentPage++;
            updatePagination();
        }
    }

    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.page) {
            currentPage = event.state.page;
            updatePagination();
        }
    });

    // Inicializar el paginado y la búsqueda
    setupPagination();
    updatePagination();

    document.getElementById("botonImprimir").addEventListener("click", function () {
        displayAllRecords();
        window.print();

        updatePagination();
    });

    function displayAllRecords() {
        for (let i = 0; i < tablaRegistros.length; i++) {
            tablaRegistros[i].style.display = '';
        }
    }
});


//Tabla cotizaciones
document.addEventListener('DOMContentLoaded', function () {
    const inputBusqueda = document.getElementById('busqueda_automatica');
    const tablaRegistros = document.getElementById('tabla_cotizaciones').querySelectorAll('tbody tr');
    const mensajeNoEncontrado = document.getElementById('mensajeNoEncontrado');
    const pagination = document.getElementById('pagination');

    let currentPage = 1;
    let previousPage = 1;
    const recordsPerPage = 8;
    let filteredRows = [];

    function displayFilteredRecords(startIndex, endIndex) {
        for (let i = 0; i < filteredRows.length; i++) {
            filteredRows[i].style.display = i >= startIndex && i < endIndex ? '' : 'none';
        }
    }

    function updateFilteredPagination() {
        const pageCount = Math.ceil(filteredRows.length / recordsPerPage);

        pagination.innerHTML = '';

        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');
            if (i === currentPage) {
                li.classList.add('active');
            }
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', function (event) {
                currentPage = parseInt(event.target.text);
                updateFilteredPagination();
            });

            pagination.appendChild(li);
        }

        const previousBtn = document.getElementById('previousBtn');
        const nextBtn = document.getElementById('nextBtn');

        previousBtn.addEventListener('click', goToPreviousFilteredPage);
        nextBtn.addEventListener('click', goToNextFilteredPage);

        previousBtn.style.display = currentPage > 1 ? '' : 'none';
        nextBtn.style.display = currentPage < pageCount ? '' : 'none';

        displayFilteredRecords((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
    }

    function goToPreviousFilteredPage() {
        if (currentPage > 1) {
            currentPage--;
            updateFilteredPagination();
        }
    }

    function goToNextFilteredPage() {
        const pageCount = Math.ceil(filteredRows.length / recordsPerPage);

        if (currentPage < pageCount) {
            currentPage++;
            updateFilteredPagination();
        }
    }

    function filterRecords() {
        const textoBusqueda = inputBusqueda.value.toLowerCase();
        filteredRows = [];

        for (let i = 0; i < tablaRegistros.length; i++) {
            const registro = tablaRegistros[i];
            const modelo = registro.cells[0].textContent.toLowerCase();

            if (modelo.includes(textoBusqueda)) {
                filteredRows.push(registro);
            } else {
                registro.style.display = 'none';
            }
        }

        if (textoBusqueda !== '') {
            previousPage = currentPage;
            currentPage = 1;
        } else {
            currentPage = previousPage;
        }

        history.replaceState({ page: currentPage }, null, `?page=${currentPage}`);

        updateFilteredPagination();
    }

    inputBusqueda.addEventListener('input', function () {
        filterRecords();
    });

    function displayRecords(startIndex, endIndex) {
        for (let i = 0; i < tablaRegistros.length; i++) {
            tablaRegistros[i].style.display = i >= startIndex && i < endIndex ? '' : 'none';
        }
    }

    function setupPagination() {
        const pageCount = Math.ceil(tablaRegistros.length / recordsPerPage);

        pagination.innerHTML = '';

        for (let i = 1; i <= pageCount; i++) {
            const li = document.createElement('li');
            li.classList.add('page-item');
            if (i === currentPage) {
                li.classList.add('active');
            }
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', function (event) {
                currentPage = parseInt(event.target.text);
                updatePagination();
            });

            pagination.appendChild(li);
        }

        const previousBtn = document.getElementById('previousBtn');
        const nextBtn = document.getElementById('nextBtn');

        previousBtn.addEventListener('click', goToPreviousPage);
        nextBtn.addEventListener('click', goToNextPage);

        previousBtn.style.display = currentPage > 1 ? '' : 'none';
        nextBtn.style.display = currentPage < pageCount ? '' : 'none';

        displayRecords((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
    }

    function updatePagination() {
        const pageCount = Math.ceil(tablaRegistros.length / recordsPerPage);

        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;

        displayRecords(startIndex, endIndex);
        updatePaginationStyles();

        const previousBtn = document.getElementById('previousBtn');
        const nextBtn = document.getElementById('nextBtn');

        previousBtn.style.display = currentPage > 1 ? '' : 'none';
        nextBtn.style.display = currentPage < pageCount ? '' : 'none';
    }

    function updatePaginationStyles() {
        const items = pagination.getElementsByClassName('page-item');

        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
        }

        items[currentPage - 1].classList.add('active');
    }

    function goToPreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    }

    function goToNextPage() {
        const pageCount = Math.ceil(tablaRegistros.length / recordsPerPage);

        if (currentPage < pageCount) {
            currentPage++;
            updatePagination();
        }
    }

    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.page) {
            currentPage = event.state.page;
            updatePagination();
        }
    });

    // Inicializar el paginado y la búsqueda
    setupPagination();
    updatePagination(); // Agregado para asegurar que se muestren solo los primeros registros al cargar la página

    document.getElementById("botonImprimir").addEventListener("click", function () {
        filterRecordsByWeek();
        window.print();
        updatePagination();
    });

    // Función para filtrar registros por semana
    function filterRecordsByWeek() {
        const today = moment(); // Obtener la fecha actual
        const startOfWeek = today.clone().startOf('isoWeek'); // Inicio de la semana actual
        const endOfWeek = today.clone().endOf('isoWeek'); // Fin de la semana actual

        for (let i = 0; i < tablaRegistros.length; i++) {
            const registro = tablaRegistros[i];
            const fechaTexto = registro.cells[7].textContent; // Ajustar el índice según la posición de la fecha en tu fila
            const fechaCotizacion = moment(fechaTexto, 'YYYY-MM-DD');

            if (fechaCotizacion.isBetween(startOfWeek, endOfWeek, null, '[]')) {
                registro.style.display = ''; // Mostrar registros de la semana
            } else {
                registro.style.display = 'none'; // Ocultar registros fuera de la semana
            }
        }
    }

});

function togglePasswordVisibility() {
    var passwordInput = document.getElementById("act_psw");
    var togglePasswordButton = document.getElementById("toggle-password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePasswordButton.innerHTML = '<i class="far fa-eye"></i>';
    } else {
        passwordInput.type = "password";
        togglePasswordButton.innerHTML = '<i class="far fa-eye-slash"></i> ';
    }
}
function mostrarNuevaImagen(input) {
    var imagenActual = document.getElementById('imagen_actual');
    var imagenPlaceholder = document.getElementById('imagen_placeholder');
    var imagenSeleccionadaInput = document.getElementById('imagen_seleccionada');

    // Verificar si se seleccionó un archivo
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            // Mostrar la nueva imagen en el segundo espacio
            imagenPlaceholder.src = e.target.result;
            // Mostrar el segundo input
            imagenPlaceholder.style.display = 'inline-block';
            // Guardar el nombre de la nueva imagen en el input oculto
            imagenSeleccionadaInput.value = input.files[0].name;
        };

        // Leer el contenido del archivo seleccionado
        reader.readAsDataURL(input.files[0]);
    } else {
        // Manejar el caso cuando no se selecciona ningún archivo
        // Ocultar el segundo input
        imagenPlaceholder.style.display = 'none';
        // Limpiar el valor del input oculto
        imagenSeleccionadaInput.value = '';
    }
}
function actualizarDatos() {
    // Simulamos una llamada al servidor con una pequeña demora (puedes eliminar esto en tu código real)
    setTimeout(function () {
        // Luego de la demora, mostramos la alerta
        alert("Actualización exitosa");
    }, 1000); // Cambia este valor según tus necesidades o elimínalo si no es necesario simular la demora
}
function validarContraseña() {
    var contraseña = document.getElementById("act_psw").value;
    var regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    var feedback = document.getElementById("password-feedback");

    if (regex.test(contraseña)) {
        feedback.innerHTML = "";
        return true;
    } else {
        feedback.innerHTML = "La contraseña debe contener al menos 8 caracteres, incluyendo al menos una letra y un número.";
        return false;
    }
}
function togglePasswordVisibilityadmin() {
    var passwordInput = document.getElementById("psw");
    var togglePasswordButton = document.getElementById("toggle-password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePasswordButton.innerHTML = '<i class="far fa-eye"></i>';
    } else {
        passwordInput.type = "password";
        togglePasswordButton.innerHTML = '<i class="far fa-eye-slash"></i> ';
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Tu código JavaScript de paginación aquí
    const inputBusqueda = document.getElementById('busqueda_automatica');
    const tablaRegistros = document.getElementById('miTabla').querySelectorAll('tbody tr');
    const mensajeNoEncontrado = document.getElementById('mensajeNoEncontrado');
    const pagination = document.getElementById('pagination');

    let currentPage = 1;
    let previousPage = 1;
    const recordsPerPage = 2;
    let filteredRows = [];

    // Resto del script aquí

    // Inicializar el paginado y la búsqueda
    setupPagination();
    updatePagination(); // Agregado para asegurar que se muestren solo los primeros registros al cargar la página

    // Funcionalidad para el botón de imprimir
    document.getElementById("botonImprimir").addEventListener("click", function () {
        // Filtrar los registros por semana antes de imprimir
        filterRecordsByWeek();

        // Mostrar todos los registros después de imprimir
        window.print();

        // Restaurar la paginación y mostrar los registros originales
        updatePagination();
    });

    // Función para filtrar registros por semana
    function filterRecordsByWeek() {
        const today = moment(); // Obtener la fecha actual
        const startOfWeek = today.clone().startOf('isoWeek'); // Inicio de la semana actual
        const endOfWeek = today.clone().endOf('isoWeek'); // Fin de la semana actual

        for (let i = 0; i < tablaRegistros.length; i++) {
            const registro = tablaRegistros[i];
            const fechaTexto = registro.cells[7].textContent; // Ajustar el índice según la posición de la fecha en tu fila
            const fechaCotizacion = moment(fechaTexto, 'YYYY-MM-DD'); // Ajustar el formato según tus datos

            if (fechaCotizacion.isBetween(startOfWeek, endOfWeek, null, '[]')) {
                registro.style.display = ''; // Mostrar registros de la semana
            } else {
                registro.style.display = 'none'; // Ocultar registros fuera de la semana
            }
        }
    }
});

$(document).ready(function () {
    // Número de registros por página
    var recordsPerPage = 3;

    // Calcula el número total de páginas
    var totalRecords = $("#tabla_imagenes tbody tr").length;
    var totalPages = Math.ceil(totalRecords / recordsPerPage);

    // Inicializa la paginación
    for (var i = 1; i <= totalPages; i++) {
        $("#pagination").append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
    }

    showPage(1);

    // Maneja el clic en los números de página
    $("#pagination").on("click", "a", function () {
        var currentPage = $(this).text();
        showPage(currentPage);
    });

    // Maneja el clic en los botones Anterior y Siguiente
    $("#previousBtn").on("click", function () {
        var currentPage = parseInt($("#pagination li.active a").text());
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });

    $("#nextBtn").on("click", function () {
        var currentPage = parseInt($("#pagination li.active a").text());
        if (currentPage < totalPages) {
            showPage(currentPage + 1);
        }
    });

    // Función para mostrar la página actual
    function showPage(page) {
        $("#pagination li").removeClass("active");
        $("#pagination li:contains('" + page + "')").addClass("active");

        var start = (page - 1) * recordsPerPage;
        var end = start + recordsPerPage;

        $("#tabla_imagenes tbody tr").hide();
        $("#tabla_imagenes tbody tr").slice(start, end).show();
    }
});
