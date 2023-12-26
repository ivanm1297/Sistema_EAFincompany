$(document).ready(function () {
    // Utiliza AJAX para cargar el carrusel de imágenes
    $.ajax({
        url: '/dashboard', // Ruta de Flask para cargar el carrusel
        type: 'GET',
        dataType: 'html',
        success: function (response) {
            $('#carrusel-container').html(response); // Coloca el carrusel cargado en el contenedor
        },
        error: function () {
            console.error('Error al cargar el carrusel');
        }
    });
});

// Evitar que el usuario regrese a la página anterior
window.onpageshow = function (event) {
    if (event.persisted) {
        window.location.reload();
    }
};



// pagination.js

$(document).ready(function () {
    var $table = $('#myTable');
    var $tbody = $table.find('tbody');
    var $rows = $tbody.find('tr');
    var row_count = $rows.length;
    var rows_per_page = 4; // Cantidad de registros por página

    if (row_count > rows_per_page) {
        var num_pages = Math.ceil(row_count / rows_per_page);
        var current_page = 1;

        // Mostrar números de página entre las flechas
        for (var i = 1; i <= num_pages; i++) {
            $('.pagination').append('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
        }

        // Ocultar todas las filas
        $rows.hide();

        // Mostrar las filas de la página actual
        $rows.slice(0, rows_per_page).show();

        // Manejar el clic en los números de página
        $('.pagination').on('click', 'a', function (e) {
            e.preventDefault();
            current_page = parseInt($(this).text());
            var start = (current_page - 1) * rows_per_page;
            var end = start + rows_per_page;

            $rows.hide();
            $rows.slice(start, end).show();
        });
    } else {
        $('#pagination').hide(); // Ocultar la paginación si no hay suficientes registros
    }
});

document.addEventListener("DOMContentLoaded", function () {
    var items = document.querySelectorAll(".card");
    var itemsPerPage = 5;
    var currentPage = 1;

    var busquedaModelo = document.getElementById("busquedaModelo");
    var paginado = document.getElementById("paginado");

    // Agrega un evento de entrada al campo de búsqueda
    busquedaModelo.addEventListener('input', function () {
        var busqueda = busquedaModelo.value.toLowerCase();

        // Filtra los elementos según la búsqueda
        var resultados = Array.from(items).filter(function (item) {
            var texto = item.innerText.toLowerCase();
            return texto.indexOf(busqueda) > -1;
        });

        // Actualiza el paginado según la cantidad de resultados
        updatePaginationDisplay(resultados);

        // Reinicia la paginación al realizar una búsqueda
        currentPage = 1;
        updatePagination();
    });

    // Oculta todos los elementos
    function hideAllItems() {
        items.forEach(function (item) {
            item.style.display = "none";
        });
    }

    // Muestra solo los elementos de la página actual
    function showItems(page) {
        var startIndex = (page - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;

        for (var i = startIndex; i < endIndex && i < items.length; i++) {
            items[i].style.display = "block";
        }
    }

    // Calcula el número total de páginas
    function calculateTotalPages() {
        return Math.ceil(items.length / itemsPerPage);
    }

    // Actualiza el paginado según la cantidad de resultados
    function updatePaginationDisplay(resultados) {
        var totalResultados = resultados.length;

        if (totalResultados > itemsPerPage) {
            paginado.style.display = 'block';
            hideAllItems();
            showItems(currentPage);
            addPaginationButtons();
        } else {
            paginado.style.display = 'none';
            hideAllItems();
            // Muestra solo los resultados (sin paginado)
            for (var i = 0; i < totalResultados; i++) {
                resultados[i].style.display = "block";
            }
        }
    }

    // Agrega botones de paginación
    function addPaginationButtons() {
        var totalPages = calculateTotalPages();
        var paginationContainer = document.createElement("div");
        paginationContainer.classList.add("text-center", "mt-4"); // Añadido "text-center" para centrar

        var prevButton = createPaginationButton('<<', function () {
            if (currentPage > 1) {
                currentPage--;
                hideAllItems();
                showItems(currentPage);
                updatePaginationButtons();
            }
        });

        paginationContainer.appendChild(prevButton);

        for (var i = 1; i <= totalPages; i++) {
            var button = createPaginationButton(i, function () {
                currentPage = parseInt(this.innerText);
                hideAllItems();
                showItems(currentPage);
                updatePaginationButtons();
            });

            paginationContainer.appendChild(button);
        }

        var nextButton = createPaginationButton('>>', function () {
            if (currentPage < totalPages) {
                currentPage++;
                hideAllItems();
                showItems(currentPage);
                updatePaginationButtons();
            }
        });

        paginationContainer.appendChild(nextButton);

        document.querySelector(".container").appendChild(paginationContainer);

        // Inicializa el estado de los botones de paginación
        updatePaginationButtons();
    }

    // Crea un botón de paginación con manejo de clic personalizado
    function createPaginationButton(label, clickHandler) {
        var button = document.createElement("button");
        button.classList.add("btn", "btn-outline-danger", "mr-2", "bg-red"); // Cambiado a "btn-outline-secondary" y "bg-gray"
        button.innerText = label;

        button.addEventListener("click", clickHandler);

        return button;
    }

    // Actualiza el estado de los botones de paginación para resaltar la página actual
    function updatePaginationButtons() {
        var buttons = document.querySelectorAll(".btn-outline-danger");
        buttons.forEach(function (button) {
            button.classList.remove("btn-danger", "text-white", "border-red", "text-red");
        });

        var currentPageButton = document.querySelector(`.btn-outline-danger:nth-child(${currentPage + 1})`);
        currentPageButton.classList.add("btn-danger", "text-white", "border-red", "text-red");
    }

    // Inicia la paginación
    function initPagination() {
        hideAllItems();
        showItems(currentPage);
        addPaginationButtons();
    }

    // Inicia la paginación al cargar la página
    initPagination();
});



