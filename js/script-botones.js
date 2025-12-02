const btnAdidas = document.querySelector('.btn-adidas');
const btnNike = document.querySelector('.btn-nike');
const btnPuma = document.querySelector('.btn-puma');
const contenedorZapatillas = document.querySelector('.content-zapatillas');

document.addEventListener('DOMContentLoaded', () => {
    filtrarZapatillas();
    mostrarMarca('adidas');
});

const filtrarZapatillas = () => {
    let zapatillasArray = [];
    const zapatillas = document.querySelectorAll('.zapatilla');
    zapatillas.forEach(zapatilla => zapatillasArray = [...zapatillasArray, zapatilla]);

    const adidas = zapatillasArray.filter(zap => zap.getAttribute('data-marca') === 'adidas');
    const nike = zapatillasArray.filter(zap => zap.getAttribute('data-marca') === 'nike');
    const puma = zapatillasArray.filter(zap => zap.getAttribute('data-marca') === 'puma');

    mostrarZapatillas(adidas, nike, puma);
};

const mostrarZapatillas = (adidas, nike, puma) => {
    btnAdidas.addEventListener('click', () => {
        limpiarHtml(contenedorZapatillas);
        adidas.forEach(zap => contenedorZapatillas.appendChild(zap));
        actualizarBotonActivo(btnAdidas);
    });

    btnNike.addEventListener('click', () => {
        limpiarHtml(contenedorZapatillas);
        nike.forEach(zap => contenedorZapatillas.appendChild(zap));
        actualizarBotonActivo(btnNike);
    });

    btnPuma.addEventListener('click', () => {
        limpiarHtml(contenedorZapatillas);
        puma.forEach(zap => contenedorZapatillas.appendChild(zap));
        actualizarBotonActivo(btnPuma);
    });
}

const mostrarMarca = (marca) => {
    const zapatillas = document.querySelectorAll('.zapatilla');
    limpiarHtml(contenedorZapatillas);
    zapatillas.forEach(zap => {
        if(zap.getAttribute('data-marca') === marca) {
            contenedorZapatillas.appendChild(zap);
        }
    });
    const botonActivo = document.querySelector(`.btn-${marca}`);
    actualizarBotonActivo(botonActivo);
}

const actualizarBotonActivo = (botonActivo) => {
    document.querySelectorAll('.content-button button').forEach(btn => {
        btn.classList.remove('active');
    });
    botonActivo.classList.add('active');
}

const limpiarHtml = (contenedor) => {
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}