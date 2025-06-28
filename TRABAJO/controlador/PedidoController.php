<?php
// controlador/PedidoController.php
require_once __DIR__.'/../modelos/Pedido.php';
require_once __DIR__.'/../modelos/Notificacion.php';

class PedidoController {
    public function guardar($d) {
        $m = new Pedido();
        $id = $m->guardar($d['cliente_id'], $d['items']);
        return $id 
            ? "Pedido #$id registrado"
            : "Error al registrar pedido";
    }

    public function mostrar() {
        return (new Pedido())->mostrar();
    }

    public function buscar($id) {
        return (new Pedido())->buscar($id);
    }

    public function actualizarEstado($d) {
        $ok = (new Pedido())->actualizarEstado($d['id'], $d['estado']);
        if ($ok && $d['estado']==='listo') {
            (new Notificacion())->crear($d['id'], $d['medio'] ?? 'email');
        }
        header('Location: index.php?c=Pedido&a=buscar&id='.$d['id']);
    }

    public function eliminar($id) {
        (new Pedido())->eliminar($id);
        header('Location: index.php?c=Pedido&a=mostrar');
    }
}
