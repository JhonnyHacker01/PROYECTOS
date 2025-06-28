<?php
// modelos/Pedido.php
require_once __DIR__.'/../config/Conn.php';

class Pedido {
    private $db;
    public function __construct() {
        $this->db = (new Conn())->conectar();
    }

    public function guardar($clienteId, array $items) {
        $this->db->beginTransaction();
        $this->db
            ->prepare('INSERT INTO pedidos (cliente_id, estado, fecha) VALUES (?, "pendiente", NOW())')
            ->execute([$clienteId]);
        $pid = $this->db->lastInsertId();

        $stmt = $this->db
            ->prepare('INSERT INTO detalle_pedido (pedido_id, libro_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)');
        foreach ($items as $it) {
            $stmt->execute([$pid, $it['libro_id'], $it['cantidad'], $it['precio_unitario']]);
        }
        $this->db->commit();
        return $pid;
    }

    public function mostrar() {
        return $this->db
            ->query('SELECT p.*, c.nombre AS cliente
                     FROM pedidos p
                     JOIN clientes c ON c.id=p.cliente_id')
            ->fetchAll();
    }

    public function buscar($id) {
        $ped = $this->db
            ->query("SELECT p.*, c.nombre AS cliente
                     FROM pedidos p
                     JOIN clientes c ON c.id=p.cliente_id
                     WHERE p.id=$id")
            ->fetch();
        $det = $this->db
            ->query("SELECT d.*, l.titulo
                     FROM detalle_pedido d
                     JOIN libros l ON l.id=d.libro_id
                     WHERE d.pedido_id=$id")
            ->fetchAll();
        $ped['detalle'] = $det;
        return $ped;
    }

    public function actualizarEstado($id, $estado) {
        return $this->db
            ->prepare('UPDATE pedidos SET estado=? WHERE id=?')
            ->execute([$estado, $id]);
    }

    public function eliminar($id) {
        return $this->db
            ->prepare('DELETE FROM pedidos WHERE id = ?')
            ->execute([$id]);
    }
}
