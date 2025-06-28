<?php
// modelos/Notificacion.php
require_once __DIR__.'/../config/Conn.php';

class Notificacion {
    private $db;
    public function __construct() {
        $this->db = (new Conn())->conectar();
    }

    public function crear($pedidoId, $medio) {
        return $this->db
            ->prepare('INSERT INTO notificaciones (pedido_id, medio, enviado_en) VALUES (?, ?, NOW())')
            ->execute([$pedidoId, $medio]);
    }

    public function mostrarPorPedido($pedidoId) {
        return $this->db
            ->query("SELECT * FROM notificaciones WHERE pedido_id=$pedidoId")
            ->fetchAll();
    }
}
