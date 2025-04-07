 // Esperar a que el documento esté completamente cargado
 document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos necesarios
    const mainImg = document.getElementById('main-img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Agregar evento click a cada miniatura
    thumbnails.forEach(function(thumbnail) {
        thumbnail.addEventListener('click', function() {
            // Cambiar la imagen principal
            const newSrc = this.getAttribute('data-src');
            mainImg.src = newSrc;
            
            // Quitar la clase 'active' de todas las miniaturas
            thumbnails.forEach(function(thumb) {
                thumb.classList.remove('active');
            });
            
            // Agregar la clase 'active' a la miniatura seleccionada
            this.classList.add('active');
        });
    });
});