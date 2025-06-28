<?php
// Elimina esta línea:
- require_once __DIR__ . '/Pedido.php';

class Inventario {
    private $db;
    public function __construct() {
        $this->db = (new Conn())->conectar();
    }
    // …
}
