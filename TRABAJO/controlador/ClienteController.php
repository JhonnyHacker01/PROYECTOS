<?php
// controlador/ClienteController.php
require_once __DIR__.'/../modelos/Cliente.php';

class ClienteController {
    public function guardar($d) {
        $m = new Cliente();
        return $m->guardar($d['nombre'], $d['correo'], $d['telefono'])
            ? "Cliente registrado"
            : "Error al registrar cliente";
    }

    public function mostrar() {
        return (new Cliente())->mostrar();
    }

    public function buscar($id) {
        return (new Cliente())->buscar($id);
    }

    public function actualizar($d) {
        $ok = (new Cliente())->actualizar($d['id'], $d['nombre'], $d['correo'], $d['telefono']);
        return $ok ? header('Location: index.php?c=Cliente&a=mostrar')
                   : "Error al actualizar";
    }

    public function eliminar($id) {
        (new Cliente())->eliminar($id);
        header('Location: index.php?c=Cliente&a=mostrar');
    }
}
