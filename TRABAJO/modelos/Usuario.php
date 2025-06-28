<?php
require_once __DIR__ . '/../config/Conn.php';

class Usuario {
    private $db;
    public function __construct() {
        $this->db = (new Conn())->conectar();
    }

    public function guardar(array $d) {
        return $this->db
            ->prepare('INSERT INTO usuarios (username,password,nombres,apellidos,tipo,escuela,email) VALUES (?,?,?,?,?,?,?)')
            ->execute([
                $d['username'], $d['password'],
                $d['nombres'], $d['apellidos'],
                $d['tipo'],     $d['escuela'],
                $d['email']
            ]);
    }

    public function mostrar() {
        return $this->db
            ->query('SELECT id,username,nombres,apellidos,tipo,escuela,email FROM usuarios')
            ->fetchAll();
    }

    public function buscar($id) {
        return $this->db
            ->prepare('SELECT * FROM usuarios WHERE id = ?')
            ->execute([$id])
            ? $this->db->query("SELECT * FROM usuarios WHERE id=$id")->fetch()
            : null;
    }

    public function actualizar(array $d) {
        return $this->db
            ->prepare('UPDATE usuarios SET nombres=?,apellidos=?,tipo=?,escuela=?,email=? WHERE id=?')
            ->execute([
                $d['nombres'], $d['apellidos'],
                $d['tipo'],    $d['escuela'],
                $d['email'],   $d['id']
            ]);
    }

    public function eliminar($id) {
        return $this->db
            ->prepare('DELETE FROM usuarios WHERE id = ?')
            ->execute([$id]);
    }
}
