<?php
// controlador/LibroController.php
require_once __DIR__.'/../modelos/Libro.php';

class LibroController {
    public function mostrar() {
        return (new Libro())->mostrar();
    }

    public function buscar($id) {
        return (new Libro())->buscar($id);
    }
}
