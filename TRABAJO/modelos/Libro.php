<?php
// modelos/Libro.php
require_once __DIR__.'/../config/Conn.php';

class Libro {
    private $db;
    public function __construct() {
        $this->db = (new Conn())->conectar();
    }

    public function mostrar() {
        return $this->db
            ->query('SELECT * FROM libros')
            ->fetchAll();
    }

    public function buscar($id) {
        return $this->db
            ->query("SELECT * FROM libros WHERE id=$id")
            ->fetch();
    }
}
