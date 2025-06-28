<?php
// controlador/NotificacionController.php
require_once __DIR__.'/../modelos/Notificacion.php';

class NotificacionController {
    public function mostrar($pedidoId) {
        return (new Notificacion())->mostrarPorPedido($pedidoId);
    }
}
