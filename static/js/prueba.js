document.addEventListener('DOMContentLoaded', function () {
    const inputBusqueda = document.getElementById('busqueda_automatica');
    const tablaRegistros = document.getElementById('miTabla').querySelectorAll('tbody tr');
    const mensajeNoEncontrado = document.getElementById('mensajeNoEncontrado');
    const pagination = document.getElementById('pagination');

    let currentPage = 1;
    let previousPage = 1; // Almacena la página antes de realizar la búsqueda
    const recordsPerPage = 4; // Ajusta según tus necesidades
    let filteredRows = [];

    // Función para mostrar los registros en la tabla después de la búsqueda
    function displayFilteredRecords(startIndex, endIndex) {
        for (let i = 0; i < filteredRows.length; i++) {
            filteredRows[i].style.display = i >= startIndex && i < endIndex ? '' : 'none';
        }
    }

    // Función para actualizar la paginación después de la búsqueda
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

    // Función para ir a la página anterior después de la búsqueda
    function goToPreviousFilteredPage() {
        if (currentPage > 1) {
            currentPage--;
            updateFilteredPagination();
        }
    }

    // Función para ir a la página siguiente después de la búsqueda
    function goToNextFilteredPage() {
        const pageCount = Math.ceil(filteredRows.length / recordsPerPage);

        if (currentPage < pageCount) {
            currentPage++;
            updateFilteredPagination();
        }
    }

    // Función para filtrar los registros según la búsqueda
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

        // Al realizar una búsqueda, actualizamos la paginación sin cambiar la página actual
        if (textoBusqueda !== '') {
            previousPage = currentPage;
            currentPage = 1;
        } else {
            currentPage = previousPage;
        }

        // Actualiza el historial del navegador al cambiar de página
        history.replaceState({ page: currentPage }, null, `?page=${currentPage}`);

        updateFilteredPagination();
    }

    // Evento para la búsqueda
    inputBusqueda.addEventListener('input', function () {
        filterRecords();
    });

    // Función para mostrar los registros en la tabla
    function displayRecords(startIndex, endIndex) {
        for (let i = 0; i < tablaRegistros.length; i++) {
            tablaRegistros[i].style.display = i >= startIndex && i < endIndex ? '' : 'none';
        }
    }

    // Función para calcular el número total de páginas
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

    // Función para actualizar el paginado y mostrar los registros correspondientes
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

    // Función para actualizar estilos de paginado al cambiar de página
    function updatePaginationStyles() {
        const items = pagination.getElementsByClassName('page-item');

        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
        }

        items[currentPage - 1].classList.add('active');
    }

    // Función para ir a la página anterior
    function goToPreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    }

    // Función para ir a la página siguiente
    function goToNextPage() {
        const pageCount = Math.ceil(tablaRegistros.length / recordsPerPage);

        if (currentPage < pageCount) {
            currentPage++;
            updatePagination();
        }
    }

    // Manejar el evento "popstate" para cambiar de página al usar los botones de retroceso/navegación del navegador
    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.page) {
            currentPage = event.state.page;
            updatePagination();
        }
    });

    // Inicializar el paginado y la búsqueda
    setupPagination();
    updatePagination(); // Agregado para asegurar que se muestren solo los primeros registros al cargar la página
});

//Tabla cotizaciones

document.addEventListener('DOMContentLoaded', function () {
    const inputBusqueda = document.getElementById('busqueda_automatica');
    const tablaRegistros = document.getElementById('tabla_cotizaciones').querySelectorAll('tbody tr');
    const mensajeNoEncontrado = document.getElementById('mensajeNoEncontrado');
    const pagination = document.getElementById('pagination');

    let currentPage = 1;
    let previousPage = 1; // Almacena la página antes de realizar la búsqueda
    const recordsPerPage = 8; // Ajusta según tus necesidades
    let filteredRows = [];

    // Función para mostrar los registros en la tabla después de la búsqueda
    function displayFilteredRecords(startIndex, endIndex) {
        for (let i = 0; i < filteredRows.length; i++) {
            filteredRows[i].style.display = i >= startIndex && i < endIndex ? '' : 'none';
        }
    }

    // Función para actualizar la paginación después de la búsqueda
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

    // Función para ir a la página anterior después de la búsqueda
    function goToPreviousFilteredPage() {
        if (currentPage > 1) {
            currentPage--;
            updateFilteredPagination();
        }
    }

    // Función para ir a la página siguiente después de la búsqueda
    function goToNextFilteredPage() {
        const pageCount = Math.ceil(filteredRows.length / recordsPerPage);

        if (currentPage < pageCount) {
            currentPage++;
            updateFilteredPagination();
        }
    }

    // Función para filtrar los registros según la búsqueda
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

        // Al realizar una búsqueda, actualizamos la paginación sin cambiar la página actual
        if (textoBusqueda !== '') {
            previousPage = currentPage;
            currentPage = 1;
        } else {
            currentPage = previousPage;
        }

        // Actualiza el historial del navegador al cambiar de página
        history.replaceState({ page: currentPage }, null, `?page=${currentPage}`);

        updateFilteredPagination();
    }

    // Evento para la búsqueda
    inputBusqueda.addEventListener('input', function () {
        filterRecords();
    });

    // Función para mostrar los registros en la tabla
    function displayRecords(startIndex, endIndex) {
        for (let i = 0; i < tablaRegistros.length; i++) {
            tablaRegistros[i].style.display = i >= startIndex && i < endIndex ? '' : 'none';
        }
    }

    // Función para calcular el número total de páginas
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

    // Función para actualizar el paginado y mostrar los registros correspondientes
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

    // Función para actualizar estilos de paginado al cambiar de página
    function updatePaginationStyles() {
        const items = pagination.getElementsByClassName('page-item');

        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
        }

        items[currentPage - 1].classList.add('active');
    }

    // Función para ir a la página anterior
    function goToPreviousPage() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    }

    // Función para ir a la página siguiente
    function goToNextPage() {
        const pageCount = Math.ceil(tablaRegistros.length / recordsPerPage);

        if (currentPage < pageCount) {
            currentPage++;
            updatePagination();
        }
    }

    // Manejar el evento "popstate" para cambiar de página al usar los botones de retroceso/navegación del navegador
    window.addEventListener('popstate', function (event) {
        if (event.state && event.state.page) {
            currentPage = event.state.page;
            updatePagination();
        }
    });

    // Inicializar el paginado y la búsqueda
    setupPagination();
    updatePagination(); // Agregado para asegurar que se muestren solo los primeros registros al cargar la página
});
