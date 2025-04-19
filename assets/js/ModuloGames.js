// Función para cargar los datos del JSON
async function cargarProductos() {
    try {
        // Verificar si hay datos en localStorage primero
        const datosLocalStorage = localStorage.getItem('productosData');
        if (datosLocalStorage) {
            return JSON.parse(datosLocalStorage).productos;
        }
        
        // Si no hay datos en localStorage, intentamos cargar desde el archivo JSON
        const respuesta = await fetch('../../assets/json/Productos.json');
        
        // Verificamos si la respuesta es correcta
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        // Convertimos la respuesta a JSON
        const datos = await respuesta.json();
        
        // Guardamos en localStorage para futuras referencias
        localStorage.setItem('productosData', JSON.stringify(datos));
        
        return datos.productos;
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        
        // En caso de error, mostramos un mensaje en la consola y devolvemos un array vacío
        console.log('Asegúrate de que el archivo /datos/productos.json existe y es accesible');
        return [];
    }
}

function createCard (producto) {
    const card = document.createElement('div');
    card.className = 'game-card';

    const img = document.createElement('img');
    img.src = producto.img;
    img.alt = producto.name;
    img.className = 'game-img';

    const title = document.createElement('div');
    title.className = 'game-title';
    title.textContent = producto.name;

    card.appendChild(img);
    card.appendChild(title);

    return card;
}

async function mostrarProductos() {
    const contenedorProductos = document.getElementById('container-games');
    
    // Mostramos un mensaje de carga
    contenedorProductos.innerHTML = '<p>Cargando productos...</p>';
    
    const productos = await cargarProductos();
    
    // Limpiar el contenedor
    contenedorProductos.innerHTML = '';
    
    // Verificar si hay productos
    if (productos.length === 0) {
        contenedorProductos.innerHTML = '<p>No hay productos disponibles.</p>';
        return;
    }
    
    // Recorrer y añadir cada producto
    productos.forEach(producto => {
        const cardProducto = createCard(producto);
        contenedorProductos.appendChild(cardProducto);
    });
}

const btnAddProduct = document.getElementById('btn-add-product');
const modal = document.getElementById('productoModal');
const closeBtn = document.querySelector('.close');
const formularioProducto = document.getElementById('formularioProducto');

// Abrir modal
btnAddProduct.addEventListener('click', function() {
    modal.style.display = 'block';
});

// Cerrar modal
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

async function guardarNuevoProducto(producto) {
    try {
        // Validar que el producto tenga los campos requeridos
        if (!producto.name || !producto.img || !producto.platform || producto.platform.length === 0) {
            throw new Error('El producto debe tener nombre, imagen y al menos una plataforma');
        }
        
        // Cargar los productos actuales
        const productos = await cargarProductos();
        
        // Asignar un ID al nuevo producto (el siguiente al máximo actual)
        let nuevoId = 1; // Valor por defecto si no hay productos
        
        // Si hay productos existentes, buscar el ID más alto y sumarle 1
        if (productos.length > 0) {
            let todosLosIds = productos.map(function(p) {
                return p.id;
            });
            
            // Encontrar el ID más alto
            let idMasAlto = Math.max(...todosLosIds);
            
            // El nuevo ID será el más alto + 1
            nuevoId = idMasAlto + 1;
        }
        
        // Crear el nuevo producto con el ID asignado
        const nuevoProducto = {
            id: nuevoId,
            name: producto.name,
            img: producto.img,
            platform: producto.platform
        };
        
        // Agregar el producto al array
        productos.push(nuevoProducto);
        
        // Guardar en localStorage para persistencia
        localStorage.setItem('productosData', JSON.stringify({productos: productos}));
        
        // Guardar en el archivo JSON
        try {
            const response = await fetch('../../assets/json/Productos.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({productos: productos})
            });
            
            if (!response.ok) {
                console.warn('No se pudo guardar en el archivo JSON. Código:', response.status);
                console.log('El producto solo se guardó en localStorage');
            } else {
                console.log('Producto guardado exitosamente en el archivo JSON');
            }
        } catch (fetchError) {
            console.warn('Error al intentar guardar en el archivo JSON:', fetchError);
            console.log('El producto solo se guardó en localStorage');
        }
        
        console.log('Producto guardado exitosamente en localStorage');
        
        // Actualizar la visualización de productos en la interfaz
        mostrarProductos(nuevoProducto);
        
        return true;
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        alert('No se pudo guardar el producto. ' + error.message);
        return false;
    }
}

 // Manejar envío del formulario
 formularioProducto.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    // Obtener plataformas seleccionadas
    const plataformasCheckboxes = document.querySelectorAll('input[name="plataformas"]:checked');
    const plataformas = Array.from(plataformasCheckboxes).map(checkbox => checkbox.value);
    
    if (plataformas.length === 0) {
        alert('Debes seleccionar al menos una plataforma');
        return;
    }
    
    const nuevoProducto = {
        name: document.getElementById('nombre').value,
        img: document.getElementById('imagen').value,
        platform: plataformas
    };
    
    const resultado = await guardarNuevoProducto(nuevoProducto);
    
    if (resultado) {
        // Limpiar el formulario
        formularioProducto.reset();
        
        // Cerrar el modal
        modal.style.display = 'none';
        
        // Mostrar mensaje de éxito
        alert('Videojuego guardado con éxito');
    }
});



document.addEventListener('DOMContentLoaded', mostrarProductos);
