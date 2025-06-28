<?php
// controlador/InventarioController.php
require_once __DIR__.'/../modelos/Inventario.php';

class InventarioController {
    public function mostrar() {
        return (new Inventario())->mostrar();
    }

    public function descontar($d) {
        (new Inventario())->descontar($d['libro_id'], $d['cantidad']);
        header('Location: index.php?c=Inventario&a=mostrar');
    }
}
