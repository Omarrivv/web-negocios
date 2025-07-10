// Utilidad para obtener la fecha local en formato YYYY-MM-DD
function obtenerFechaLocal() {
    const hoy = new Date();
    hoy.setMinutes(hoy.getMinutes() - hoy.getTimezoneOffset());
    return hoy.toISOString().split('T')[0];
}

// Utilidad para mostrar fecha en formato DD/MM/YYYY
function formatearFechaLatina(fechaStr) {
    const [a, m, d] = fechaStr.split('-');
    return `${d}/${m}/${a}`;
}

// Variables globales
let productos = [];
let lotes = [];
let ventas = [];
let costoEditandoId = null;
let ventaEditandoId = null;
let filtroProductoVentas = '';
let fechaSeleccionada = obtenerFechaLocal();

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    cargarDatos();
    inicializarNavegacion();
    document.getElementById('fechaSeleccionada').value = fechaSeleccionada;
    actualizarInterfaz();
    establecerFechaActual();
    mostrarLotes();
    mostrarReportesDiarios();
});

// ==================== NAVEGACIÓN ====================
function inicializarNavegacion() {
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remover clase active de todos los botones y tabs
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Agregar clase active al botón clickeado y su tab correspondiente
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// ==================== GESTIÓN DE DATOS ====================
function cargarDatos() {
    productos = JSON.parse(localStorage.getItem('productos')) || [];
    lotes = JSON.parse(localStorage.getItem('lotes')) || [];
    ventas = JSON.parse(localStorage.getItem('ventas')) || [];
}

function guardarDatos() {
    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.setItem('lotes', JSON.stringify(lotes));
    localStorage.setItem('ventas', JSON.stringify(ventas));
}

function actualizarInterfaz() {
    mostrarProductos();
    mostrarLotes();
    mostrarVentas();
    renderFiltroVentas();
    actualizarGanancias();
    actualizarSelects();
}

// ==================== PRODUCTOS ====================
function mostrarProductos() {
    const grid = document.getElementById('productosGrid');
    
    if (productos.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box"></i>
                <h3>No hay productos registrados</h3>
                <p>Comienza agregando tu primer producto para gestionar tus ventas</p>
                <button class="btn btn-primary" onclick="mostrarModalProducto()">
                    <i class="fas fa-plus"></i> Agregar Producto
                </button>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = productos.map(producto => `
        <div class="product-card">
            <div class="product-header">
                <div class="product-name">${producto.nombre}</div>
                <div class="product-actions">
                    <button class="btn btn-secondary" onclick="editarProducto('${producto.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="eliminarProducto('${producto.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="info-item">
                    <div class="info-label">Precio de Venta</div>
                    <div class="info-value">S/ ${producto.precioVenta.toFixed(2)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Costo Unitario</div>
                    <div class="info-value">S/ ${producto.costoUnitario.toFixed(2)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Costo del Lote</div>
                    <div class="info-value">S/ ${producto.costoLote.toFixed(2)}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Cantidad en Lote</div>
                    <div class="info-value">${producto.cantidadLote}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function guardarProducto(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombreProducto').value;
    const precioVenta = parseFloat(document.getElementById('precioVenta').value);
    const costoLote = parseFloat(document.getElementById('costoLote').value);
    const cantidadLote = parseInt(document.getElementById('cantidadLote').value);
    
    const costoUnitario = costoLote / cantidadLote;
    
    const producto = {
        id: Date.now().toString(),
        nombre,
        precioVenta,
        costoLote,
        cantidadLote,
        costoUnitario,
        fechaCreacion: new Date().toISOString()
    };
    
    productos.push(producto);
    guardarDatos();
    actualizarInterfaz();
    mostrarMensaje('¡Producto guardado correctamente!', 'success');
    // Limpiar formulario para permitir agregar otro
    document.getElementById('formProducto').reset();
    actualizarSelects();
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    // Llenar formulario con datos del producto
    document.getElementById('nombreProducto').value = producto.nombre;
    document.getElementById('precioVenta').value = producto.precioVenta;
    document.getElementById('costoLote').value = producto.costoLote;
    document.getElementById('cantidadLote').value = producto.cantidadLote;
    
    mostrarModalProducto();
    
    // Cambiar comportamiento del formulario para actualizar
    const form = document.getElementById('formProducto');
    form.onsubmit = (e) => actualizarProducto(e, id);
}

function actualizarProducto(event, id) {
    event.preventDefault();
    
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return;
    
    const nombre = document.getElementById('nombreProducto').value;
    const precioVenta = parseFloat(document.getElementById('precioVenta').value);
    const costoLote = parseFloat(document.getElementById('costoLote').value);
    const cantidadLote = parseInt(document.getElementById('cantidadLote').value);
    
    const costoUnitario = costoLote / cantidadLote;
    
    productos[index] = {
        ...productos[index],
        nombre,
        precioVenta,
        costoLote,
        cantidadLote,
        costoUnitario
    };
    
    guardarDatos();
    actualizarInterfaz();
    mostrarMensaje('¡Producto editado correctamente!', 'success');
    // No cerrar el modal ni resetear el formulario automáticamente
    const form = document.getElementById('formProducto');
    form.onsubmit = guardarProducto;
}

function eliminarProducto(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción eliminará el producto de forma permanente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            productos = productos.filter(p => p.id !== id);
            guardarDatos();
            actualizarInterfaz();
            mostrarMensaje('Producto eliminado exitosamente', 'success');
        }
    });
}

// ==================== VENTAS ====================
function mostrarVentas() {
    const list = document.getElementById('ventasList');
    let ventasFiltradas = ventas.filter(v => v.fecha === fechaSeleccionada);
    if (filtroProductoVentas) {
        ventasFiltradas = ventasFiltradas.filter(v => v.producto === filtroProductoVentas);
    }
    if (ventasFiltradas.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h3>No hay ventas registradas</h3>
                <p>Registra tus ventas para ver tus ingresos y ganancias</p>
                <button class="btn btn-primary" onclick="mostrarModalVenta()">
                    <i class="fas fa-plus"></i> Guardar venta
                </button>
            </div>
        `;
        return;
    }
    list.innerHTML = ventasFiltradas.map(venta => `
        <div class="sale-item">
            <div class="sale-info">
                <div class="sale-product">${venta.producto}</div>
                <div class="sale-details">
                    ${venta.cantidad} unidades - ${formatearFechaLatina(venta.fecha)}
                </div>
            </div>
            <div class="sale-amount">S/ ${venta.total.toFixed(2)}</div>
            <div class="product-actions">
                <button class="btn btn-secondary" onclick="editarVenta('${venta.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn btn-danger" onclick="eliminarVenta('${venta.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function guardarVenta(event) {
    event.preventDefault();
    const producto = document.getElementById('productoVenta').value;
    let cantidad = parseInt(document.getElementById('cantidadVenta').value);
    const precioUnitario = parseFloat(document.getElementById('precioUnitarioVenta').value);
    const total = parseFloat(document.getElementById('totalVenta').value);
    const fecha = document.getElementById('fechaVenta').value;

    // Validar fecha de venta >= fecha del lote más reciente disponible
    const lotesProducto = lotes.filter(l => l.producto === producto && l.stock > 0);
    if (lotesProducto.length > 0) {
        const fechaMin = lotesProducto.reduce((min, l) => l.fecha > min ? l.fecha : min, lotesProducto[0].fecha);
        if (fecha < fechaMin) {
            mostrarMensaje('No puedes registrar una venta antes de la fecha de producción más reciente disponible para este producto.', 'error');
            return;
        }
    }
    // Lógica de lotes: descontar del stock y calcular costo real de la venta
    let cantidadRestante = cantidad;
    let costoVenta = 0;
    let lotesUsados = [];
    // Buscar lotes del producto, ordenados por fecha (FIFO)
    let lotesProductoFIFO = lotes.filter(l => l.producto === producto && l.stock > 0)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    for (let lote of lotesProductoFIFO) {
        if (cantidadRestante <= 0) break;
        let usar = Math.min(lote.stock, cantidadRestante);
        let costoUnitarioLote = lote.costo / lote.cantidad;
        costoVenta += usar * costoUnitarioLote;
        lotesUsados.push({ loteId: lote.id, cantidad: usar, costoUnitario: costoUnitarioLote });
        lote.stock -= usar;
        cantidadRestante -= usar;
    }
    if (cantidadRestante > 0) {
        mostrarMensaje('No hay suficiente stock para esta venta', 'error');
        return;
    }
    const venta = {
        id: Date.now().toString(),
        producto,
        cantidad,
        precioUnitario,
        total,
        fecha,
        costoReal: costoVenta,
        lotesUsados,
        fechaCreacion: new Date().toISOString()
    };
    ventas.push(venta);
    guardarDatos();
    actualizarInterfaz();
    mostrarMensaje('¡Venta guardada correctamente!', 'success');
    document.getElementById('formVenta').reset();
    establecerFechaActual();
}

function calcularTotalVenta() {
    const cantidad = parseInt(document.getElementById('cantidadVenta').value) || 0;
    const precioUnitario = parseFloat(document.getElementById('precioUnitarioVenta').value) || 0;
    const total = cantidad * precioUnitario;
    document.getElementById('totalVenta').value = total.toFixed(2);
}

function actualizarPrecioVenta() {
    const productoSelect = document.getElementById('productoVenta');
    const producto = productos.find(p => p.nombre === productoSelect.value);
    
    if (producto) {
        document.getElementById('precioUnitarioVenta').value = producto.precioVenta.toFixed(2);
        calcularTotalVenta();
    }
    ajustarMinFechaVenta();
}

function editarVenta(id) {
    const venta = ventas.find(v => v.id === id);
    if (!venta) return;
    ventaEditandoId = id;
    document.getElementById('productoVenta').value = venta.producto;
    document.getElementById('cantidadVenta').value = venta.cantidad;
    document.getElementById('precioUnitarioVenta').value = venta.precioUnitario;
    document.getElementById('totalVenta').value = venta.total;
    document.getElementById('fechaVenta').value = venta.fecha;
    mostrarModalVenta();
    const form = document.getElementById('formVenta');
    form.onsubmit = (e) => actualizarVenta(e, id);
}

function actualizarVenta(event, id) {
    event.preventDefault();
    const index = ventas.findIndex(v => v.id === id);
    if (index === -1) return;
    const producto = document.getElementById('productoVenta').value;
    const cantidad = parseInt(document.getElementById('cantidadVenta').value);
    const precioUnitario = parseFloat(document.getElementById('precioUnitarioVenta').value);
    const total = parseFloat(document.getElementById('totalVenta').value);
    const fecha = document.getElementById('fechaVenta').value;
    ventas[index] = {
        ...ventas[index],
        producto,
        cantidad,
        precioUnitario,
        total,
        fecha
    };
    guardarDatos();
    actualizarInterfaz();
    mostrarMensaje('¡Venta editada correctamente!', 'success');
    const form = document.getElementById('formVenta');
    form.onsubmit = guardarVenta;
}

function eliminarVenta(id) {
    Swal.fire({
        title: '¿Eliminar esta venta?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            ventas = ventas.filter(v => v.id !== id);
            guardarDatos();
            actualizarInterfaz();
            mostrarMensaje('¡Venta eliminada correctamente!', 'success');
        }
    });
}

// ==================== GANANCIAS ====================
function actualizarGanancias() {
    const ingresosTotales = ventas.reduce((sum, venta) => sum + venta.total, 0);
    const costosTotales = ventas.reduce((sum, venta) => sum + (venta.costoReal || 0), 0);
    const gananciaNeta = ingresosTotales - costosTotales;
    const rentabilidad = ingresosTotales > 0 ? (gananciaNeta / ingresosTotales * 100) : 0;
    
    document.getElementById('ingresosTotales').textContent = `S/ ${ingresosTotales.toFixed(2)}`;
    document.getElementById('costosTotales').textContent = `S/ ${costosTotales.toFixed(2)}`;
    document.getElementById('gananciaNeta').textContent = `S/ ${gananciaNeta.toFixed(2)}`;
    document.getElementById('rentabilidad').textContent = `${rentabilidad.toFixed(1)}%`;
    
    mostrarGananciasPorProducto();
}

function mostrarGananciasPorProducto() {
    const container = document.getElementById('productProfits');
    
    if (productos.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-line"></i>
                <h3>No hay productos para analizar</h3>
                <p>Agrega productos y registra ventas para ver análisis de ganancias</p>
            </div>
        `;
        return;
    }
    
    const gananciasPorProducto = productos.map(producto => {
        const ventasProducto = ventas.filter(v => v.producto === producto.nombre);
        const ingresos = ventasProducto.reduce((sum, v) => sum + v.total, 0);
        const costosProducto = lotes.filter(l => l.producto === producto.nombre);
        const costos = costosProducto.reduce((sum, l) => sum + l.costo, 0);
        const ganancia = ingresos - costos;
        const rentabilidad = ingresos > 0 ? (ganancia / ingresos * 100) : 0;
        
        return {
            nombre: producto.nombre,
            ingresos,
            costos,
            ganancia,
            rentabilidad
        };
    });
    
    container.innerHTML = gananciasPorProducto.map(item => `
        <div class="product-profit-item">
            <div class="profit-info">
                <div class="profit-product">${item.nombre}</div>
                <div class="profit-details">
                    Ingresos: S/ ${item.ingresos.toFixed(2)} | Costos: S/ ${item.costos.toFixed(2)}
                </div>
            </div>
            <div class="profit-amount ${item.ganancia >= 0 ? 'profit-positive' : 'profit-negative'}">
                S/ ${item.ganancia.toFixed(2)} (${item.rentabilidad.toFixed(1)}%)
            </div>
        </div>
    `).join('');
}

// ==================== REPORTES ====================
function generarReporte() {
    const periodo = document.getElementById('reportPeriod').value;
    const fechaActual = new Date();
    
    let ventasFiltradas = ventas;
    
    switch (periodo) {
        case 'hoy':
            const hoy = fechaActual.toISOString().split('T')[0];
            ventasFiltradas = ventas.filter(v => v.fecha === hoy);
            break;
        case 'semana':
            const inicioSemana = new Date(fechaActual);
            inicioSemana.setDate(fechaActual.getDate() - 7);
            ventasFiltradas = ventas.filter(v => new Date(v.fecha) >= inicioSemana);
            break;
        case 'mes':
            const inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
            ventasFiltradas = ventas.filter(v => new Date(v.fecha) >= inicioMes);
            break;
    }
    
    mostrarRankingProductos(ventasFiltradas);
    mostrarEvolucionVentas(ventasFiltradas);
}

function mostrarRankingProductos(ventasFiltradas) {
    const container = document.getElementById('rankingProductos');
    
    if (ventasFiltradas.length === 0) {
        container.innerHTML = '<p>No hay ventas en el período seleccionado</p>';
        return;
    }
    
    const ranking = {};
    ventasFiltradas.forEach(venta => {
        if (!ranking[venta.producto]) {
            ranking[venta.producto] = { ventas: 0, ingresos: 0 };
        }
        ranking[venta.producto].ventas += venta.cantidad;
        ranking[venta.producto].ingresos += venta.total;
    });
    
    const rankingOrdenado = Object.entries(ranking)
        .map(([producto, datos]) => ({ producto, ...datos }))
        .sort((a, b) => b.ingresos - a.ingresos);
    
    container.innerHTML = rankingOrdenado.map((item, index) => `
        <div class="product-profit-item">
            <div class="profit-info">
                <div class="profit-product">#${index + 1} ${item.producto}</div>
                <div class="profit-details">${item.ventas} unidades vendidas</div>
            </div>
            <div class="profit-amount profit-positive">S/ ${item.ingresos.toFixed(2)}</div>
        </div>
    `).join('');
}

function mostrarEvolucionVentas(ventasFiltradas) {
    const container = document.getElementById('evolucionVentas');
    
    if (ventasFiltradas.length === 0) {
        container.innerHTML = '<p>No hay datos para mostrar</p>';
        return;
    }
    
    const ventasPorFecha = {};
    ventasFiltradas.forEach(venta => {
        const fecha = venta.fecha;
        if (!ventasPorFecha[fecha]) {
            ventasPorFecha[fecha] = 0;
        }
        ventasPorFecha[fecha] += venta.total;
    });
    
    const fechasOrdenadas = Object.keys(ventasPorFecha).sort();
    
    container.innerHTML = fechasOrdenadas.map(fecha => `
        <div class="product-profit-item">
            <div class="profit-info">
                <div class="profit-product">${new Date(fecha).toLocaleDateString()}</div>
                <div class="profit-details">Ventas del día</div>
            </div>
            <div class="profit-amount profit-positive">S/ ${ventasPorFecha[fecha].toFixed(2)}</div>
        </div>
    `).join('');
}

// ==================== UTILIDADES ====================
function actualizarSelects() {
    const productoSelects = ['productoVenta'];
    
    productoSelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Seleccionar producto</option>' +
                productos.map(p => `<option value="${p.nombre}">${p.nombre}</option>`).join('');
        }
    });
}

function establecerFechaActual() {
    const fechaInput = document.getElementById('fechaVenta');
    if (fechaInput) {
        fechaInput.value = obtenerFechaLocal();
    }
}

// Reemplazar alertas y confirmaciones por SweetAlert2
function mostrarMensaje(texto, tipo) {
    Swal.fire({
        text: texto,
        icon: tipo === 'success' ? 'success' : tipo === 'error' ? 'error' : 'info',
        timer: 2000,
        showConfirmButton: false,
        position: 'top',
        toast: false
    });
}

// ==================== MODALES ====================
function mostrarModalProducto() {
    document.getElementById('modalProducto').style.display = 'block';
}

function mostrarModalVenta() {
    actualizarSelects();
    establecerFechaActual();
    document.getElementById('modalVenta').style.display = 'block';
    ajustarMinFechaVenta();
}

function ajustarMinFechaVenta() {
    const producto = document.getElementById('productoVenta').value;
    const fechaInput = document.getElementById('fechaVenta');
    if (!producto || !fechaInput) return;
    // Buscar el lote más reciente disponible para ese producto
    const lotesProducto = lotes.filter(l => l.producto === producto && l.stock > 0);
    if (lotesProducto.length === 0) {
        fechaInput.min = '';
        return;
    }
    // Tomar la fecha más reciente
    const fechaMin = lotesProducto.reduce((min, l) => l.fecha > min ? l.fecha : min, lotesProducto[0].fecha);
    fechaInput.min = fechaMin;
    // Si la fecha actual es menor, ajustarla
    if (fechaInput.value < fechaMin) fechaInput.value = fechaMin;
}

function mostrarModalLote() {
    actualizarSelectsLote();
    document.getElementById('modalLote').style.display = 'block';
}

// ==================== LOTES ====================
function mostrarLotes() {
    const list = document.getElementById('lotesList');
    if (!lotes.length) {
        list.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-cubes"></i>
                <h3>No hay lotes registrados</h3>
                <p>Registra cada vez que produzcas un lote de productos</p>
                <button class="btn btn-primary" onclick="mostrarModalLote()">
                    <i class="fas fa-plus"></i> Registrar lote
                </button>
            </div>
        `;
        return;
    }
    list.innerHTML = lotes.map(lote => `
        <div class="cost-item">
            <div class="cost-info">
                <div class="cost-product">${lote.producto}</div>
                <div class="cost-details">
                    Lote de ${lote.cantidad} unidades - Costo total: S/ ${lote.costo.toFixed(2)}<br>
                    Fecha: ${formatearFechaLatina(lote.fecha)}<br>
                    <b>Stock disponible: ${lote.stock}</b><br>
                    ${lote.detalle ? `<i>Detalle: ${lote.detalle}</i><br>` : ''}
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-secondary" onclick="editarLote('${lote.id}')"><i class="fas fa-edit"></i></button>
            </div>
        </div>
    `).join('');
}

function editarLote(id) {
    const lote = lotes.find(l => l.id === id);
    if (!lote) return;
    document.getElementById('productoLote').value = lote.producto;
    document.getElementById('cantidadLoteProd').value = lote.cantidad;
    document.getElementById('costoLoteProd').value = lote.costo;
    document.getElementById('fechaLote').value = lote.fecha;
    document.getElementById('detalleLote').value = lote.detalle || '';
    mostrarModalLote();
    const form = document.getElementById('formLote');
    form.onsubmit = (e) => actualizarLote(e, id);
}

function actualizarLote(event, id) {
    event.preventDefault();
    const index = lotes.findIndex(l => l.id === id);
    if (index === -1) return;
    const producto = document.getElementById('productoLote').value;
    const cantidad = parseInt(document.getElementById('cantidadLoteProd').value);
    const costo = parseFloat(document.getElementById('costoLoteProd').value);
    const fecha = document.getElementById('fechaLote').value;
    const detalle = document.getElementById('detalleLote').value;
    // No modificar el stock ya vendido
    lotes[index] = {
        ...lotes[index],
        producto,
        cantidad,
        costo,
        fecha,
        detalle
    };
    guardarDatos();
    mostrarLotes();
    mostrarMensaje('¡Lote editado correctamente!', 'success');
    const form = document.getElementById('formLote');
    form.onsubmit = guardarLote;
}

function guardarLote(event) {
    event.preventDefault();
    const producto = document.getElementById('productoLote').value;
    const cantidad = parseInt(document.getElementById('cantidadLoteProd').value);
    const costo = parseFloat(document.getElementById('costoLoteProd').value);
    const fecha = document.getElementById('fechaLote').value;
    const detalle = document.getElementById('detalleLote').value;
    const lote = {
        id: Date.now().toString(),
        producto,
        cantidad,
        costo,
        fecha,
        stock: cantidad, // stock inicial igual a cantidad producida
        detalle
    };
    lotes.push(lote);
    guardarDatos();
    mostrarLotes();
    mostrarMensaje('¡Lote registrado correctamente!', 'success');
    document.getElementById('formLote').reset();
}

function actualizarSelectsLote() {
    const select = document.getElementById('productoLote');
    if (select) {
        select.innerHTML = '<option value="">Seleccionar producto</option>' +
            productos.map(p => `<option value="${p.nombre}">${p.nombre}</option>`).join('');
    }
}

function cerrarModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Cerrar modales al hacer clic fuera de ellos (DESACTIVADO)
// window.onclick = function(event) {
//     const modales = document.querySelectorAll('.modal');
//     modales.forEach(modal => {
//         if (event.target === modal) {
//             modal.style.display = 'none';
//         }
//     });
// } 

// Filtro de ventas por producto
function renderFiltroVentas() {
    const container = document.querySelector('.sales-container');
    if (!container) return;
    // Eliminar filtro anterior si existe
    const filtroExistente = document.getElementById('filtroVentasWrapper');
    if (filtroExistente) filtroExistente.remove();
    let productosUnicos = [...new Set(ventas.map(v => v.producto))];
    if (productos.length > 0) {
        productosUnicos = productos.map(p => p.nombre);
    }
    let html = `<div id="filtroVentasWrapper" style="margin-bottom:18px;">
        <label for="filtroVentas">Filtrar por producto: </label>
        <select id="filtroVentas" onchange="cambiarFiltroVentas()">
            <option value="">Todos</option>
            ${productosUnicos.map(p => `<option value="${p}" ${filtroProductoVentas === p ? 'selected' : ''}>${p}</option>`).join('')}
        </select>
    </div>`;
    container.insertAdjacentHTML('afterbegin', html);
}
function cambiarFiltroVentas() {
    filtroProductoVentas = document.getElementById('filtroVentas').value;
    mostrarVentas();
} 

function cambiarFechaSeleccionada() {
    fechaSeleccionada = document.getElementById('fechaSeleccionada').value;
    actualizarInterfaz();
    mostrarReportesDiarios();
}
function irHoy() {
    fechaSeleccionada = obtenerFechaLocal();
    document.getElementById('fechaSeleccionada').value = fechaSeleccionada;
    actualizarInterfaz();
    mostrarReportesDiarios();
}

function mostrarReportesDiarios() {
    const cont = document.getElementById('reportesDiarios');
    // Filtrar lotes y ventas del día seleccionado
    const lotesDia = lotes.filter(l => l.fecha === fechaSeleccionada);
    const ventasDia = ventas.filter(v => v.fecha === fechaSeleccionada);
    // Calcular ingresos, gastos y ganancias del día
    const ingresos = ventasDia.reduce((sum, v) => sum + v.total, 0);
    const gastos = lotesDia.reduce((sum, l) => sum + l.costo, 0);
    const costoVentas = ventasDia.reduce((sum, v) => sum + (v.costoReal || 0), 0);
    const ganancia = ingresos - costoVentas;
    // Mostrar resumen
    cont.innerHTML = `
        <div class='resumen-dia'>
            <div class='resumen-card'><h4>Ingresos</h4><div class='valor'>S/ ${ingresos.toFixed(2)}</div></div>
            <div class='resumen-card'><h4>Gastos de producción</h4><div class='valor'>S/ ${gastos.toFixed(2)}</div></div>
            <div class='resumen-card'><h4>Costo de lo vendido</h4><div class='valor'>S/ ${costoVentas.toFixed(2)}</div></div>
            <div class='resumen-card'><h4>Ganancia neta</h4><div class='valor'>S/ ${ganancia.toFixed(2)}</div></div>
        </div>
        <div class='grafica-diaria'><canvas id='graficaDiariaCanvas'></canvas></div>
    `;
    mostrarGraficaDiaria();
}

function mostrarGraficaDiaria() {
    // Mostrar los últimos 7 días (incluyendo el seleccionado)
    const dias = [];
    const ingresos = [];
    const gastos = [];
    const ganancias = [];
    for (let i = 6; i >= 0; i--) {
        const fecha = new Date(new Date(fechaSeleccionada).getTime() - i * 24 * 60 * 60 * 1000);
        const fechaStr = fecha.toISOString().split('T')[0];
        dias.push(fechaStr.slice(5)); // MM-DD
        const lotesDia = lotes.filter(l => l.fecha === fechaStr);
        const ventasDia = ventas.filter(v => v.fecha === fechaStr);
        const ingreso = ventasDia.reduce((sum, v) => sum + v.total, 0);
        const gasto = lotesDia.reduce((sum, l) => sum + l.costo, 0);
        const costoVentas = ventasDia.reduce((sum, v) => sum + (v.costoReal || 0), 0);
        const ganancia = ingreso - costoVentas;
        ingresos.push(ingreso);
        gastos.push(gasto);
        ganancias.push(ganancia);
    }
    // Crear gráfica
    const ctx = document.getElementById('graficaDiariaCanvas').getContext('2d');
    if (window.graficaDiariaChart) window.graficaDiariaChart.destroy();
    window.graficaDiariaChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dias,
            datasets: [
                {
                    label: 'Ingresos',
                    data: ingresos,
                    backgroundColor: 'rgba(102, 126, 234, 0.7)'
                },
                {
                    label: 'Gastos de producción',
                    data: gastos,
                    backgroundColor: 'rgba(220, 53, 69, 0.5)'
                },
                {
                    label: 'Ganancia neta',
                    data: ganancias,
                    backgroundColor: 'rgba(40, 167, 69, 0.5)'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Evolución de Ingresos, Gastos y Ganancia (últimos 7 días)' }
            },
            scales: {
                x: { stacked: true },
                y: { stacked: false, beginAtZero: true }
            }
        }
    });
} 

function abrirModalExportar() {
    document.getElementById('modalExportar').style.display = 'block';
    document.getElementById('formExportar').reset();
    document.getElementById('fechasPersonalizadas').style.display = 'none';
}
function mostrarFechasPersonalizadas() {
    const rango = document.getElementById('rangoExportacion').value;
    const fechasDiv = document.getElementById('fechasPersonalizadas');
    const fechaInicio = document.getElementById('fechaInicioExport');
    const fechaFin = document.getElementById('fechaFinExport');
    if (rango === 'personalizado') {
        fechasDiv.style.display = 'block';
        fechaInicio.required = true;
        fechaFin.required = true;
    } else {
        fechasDiv.style.display = 'none';
        fechaInicio.required = false;
        fechaFin.required = false;
        fechaInicio.value = '';
        fechaFin.value = '';
    }
}
function exportarDatos(event) {
    event.preventDefault();
    const tipo = document.getElementById('tipoExportacion').value;
    const rango = document.getElementById('rangoExportacion').value;
    let desde, hasta;
    const hoy = obtenerFechaLocal();
    if (rango === 'hoy') {
        desde = hasta = hoy;
    } else if (rango === 'semana') {
        const d = new Date(hoy);
        d.setDate(d.getDate() - 6);
        desde = d.toISOString().split('T')[0];
        hasta = hoy;
    } else if (rango === 'mes') {
        const d = new Date(hoy);
        d.setDate(1);
        desde = d.toISOString().split('T')[0];
        hasta = hoy;
    } else if (rango === 'todo') {
        desde = '2000-01-01';
        hasta = hoy;
    } else if (rango === 'personalizado') {
        desde = document.getElementById('fechaInicioExport').value;
        hasta = document.getElementById('fechaFinExport').value;
        if (!desde || !hasta || desde > hasta) {
            mostrarMensaje('Selecciona un rango de fechas válido', 'error');
            return;
        }
    }
    // Filtrar datos
    const ventasFiltradas = ventas.filter(v => v.fecha >= desde && v.fecha <= hasta);
    const lotesFiltrados = lotes.filter(l => l.fecha >= desde && l.fecha <= hasta);
    // Resumen
    const ingresos = ventasFiltradas.reduce((sum, v) => sum + v.total, 0);
    const costos = ventasFiltradas.reduce((sum, v) => sum + (v.costoReal || 0), 0);
    const ganancia = ingresos - costos;
    if (tipo === 'excel') {
        exportarCSV(ventasFiltradas, lotesFiltrados, {ingresos, costos, ganancia}, desde, hasta);
    } else {
        exportarPDFsimple(ventasFiltradas, lotesFiltrados, {ingresos, costos, ganancia}, desde, hasta);
    }
    cerrarModal('modalExportar');
}

function exportarCSV(ventas, lotes, resumen, desde, hasta) {
    let csv = '';
    csv += 'REPORTE DE VENTAS Y PRODUCCIÓN\n';
    csv += `Desde:;${formatearFechaLatina(desde)};Hasta:;${formatearFechaLatina(hasta)}\n`;
    csv += `Ingresos:;${resumen.ingresos};Costos:;${resumen.costos};Ganancia:;${resumen.ganancia}\n\n`;
    // Ventas
    csv += 'VENTAS\n';
    csv += 'Producto;Cantidad;Precio Unitario;Total;Fecha;Costo Real\n';
    ventas.forEach(v => {
        csv += `${v.producto};${v.cantidad};${v.precioUnitario};${v.total};${formatearFechaLatina(v.fecha)};${v.costoReal || ''}\n`;
    });
    csv += '\nLOTES DE PRODUCCIÓN\n';
    csv += 'Producto;Cantidad;Costo Total;Fecha;Stock;Detalle\n';
    lotes.forEach(l => {
        csv += `${l.producto};${l.cantidad};${l.costo};${formatearFechaLatina(l.fecha)};${l.stock};${l.detalle || ''}\n`;
    });
    // Descargar
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte_${desde}_a_${hasta}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    mostrarMensaje('¡Exportación a CSV completada!', 'success');
}

function exportarPDFsimple(ventas, lotes, resumen, desde, hasta) {
    try {
        let jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
        if (!jsPDF) throw new Error('No se pudo cargar jsPDF');
        const doc = new jsPDF();
        let y = 14;
        doc.setFontSize(14);
        doc.text('Reporte de Ventas y Producción', 14, y); y += 8;
        doc.setFontSize(10);
        doc.text(`Desde: ${formatearFechaLatina(desde)}  Hasta: ${formatearFechaLatina(hasta)}`, 14, y); y += 8;
        doc.text(`Ingresos: S/ ${resumen.ingresos}   Costos: S/ ${resumen.costos}   Ganancia: S/ ${resumen.ganancia}`, 14, y); y += 10;
        // Ventas
        doc.setFontSize(12);
        doc.text('Ventas', 14, y); y += 6;
        doc.setFontSize(8);
        doc.text('Producto | Cantidad | Precio Unitario | Total | Fecha | Costo Real', 14, y); y += 5;
        ventas.forEach(v => {
            doc.text(`${v.producto} | ${v.cantidad} | ${v.precioUnitario} | ${v.total} | ${formatearFechaLatina(v.fecha)} | ${v.costoReal || ''}`, 14, y);
            y += 5;
            if (y > 270) { doc.addPage(); y = 14; }
        });
        y += 5;
        doc.setFontSize(12);
        doc.text('Lotes de Producción', 14, y); y += 6;
        doc.setFontSize(8);
        doc.text('Producto | Cantidad | Costo Total | Fecha | Stock | Detalle', 14, y); y += 5;
        lotes.forEach(l => {
            doc.text(`${l.producto} | ${l.cantidad} | ${l.costo} | ${formatearFechaLatina(l.fecha)} | ${l.stock} | ${l.detalle || ''}`, 14, y);
            y += 5;
            if (y > 270) { doc.addPage(); y = 14; }
        });
        doc.save(`reporte_${desde}_a_${hasta}.pdf`);
        mostrarMensaje('¡Exportación a PDF completada!', 'success');
    } catch (e) {
        mostrarMensaje('Error al exportar a PDF. Intenta recargar la página o usar otro navegador.', 'error');
        console.error('Error exportando PDF:', e);
    }
}