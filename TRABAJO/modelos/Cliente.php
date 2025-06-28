<?php
// modelos/Cliente.php
require_once __DIR__.'/../config/Conn.php';

class Cliente {
    private $db;
    public function __construct() {
        $this->db = (new Conn())->conectar();
    }

    public function guardar($nombre, $correo, $telefono) {
        return $this->db
            ->prepare('INSERT INTO clientes (nombre, correo, telefono) VALUES (?, ?, ?)')
            ->execute([$nombre, $correo, $telefono]);
    }

    public function mostrar() {
        return $this->db
            ->query('SELECT * FROM clientes')
            ->fetchAll();
    }

    public function buscar($id) {
        return $this->db
            ->prepare('SELECT * FROM clientes WHERE id = ?')
            ->execute([$id])
            ? $this->db->query("SELECT * FROM clientes WHERE id=$id")->fetch()
            : null;
    }

    public function actualizar($id, $nombre, $correo, $telefono) {
        return $this->db
            ->prepare('UPDATE clientes SET nombre=?, correo=?, telefono=? WHERE id=?')
            ->execute([$nombre, $correo, $telefono, $id]);
    }

    public function eliminar($id) {
        return $this->db
            ->prepare('DELETE FROM clientes WHERE id = ?')
            ->execute([$id]);
    }
}
