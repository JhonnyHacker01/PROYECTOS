<?php
require_once __DIR__ . '/../modelos/Usuario.php';

class UsuarioController {
    public function guardar($d) {
        (new Usuario())->guardar($d);
        header('Location: index.php?c=Usuario&a=mostrar');
        exit;
    }

    public function mostrar() {
        return (new Usuario())->mostrar();
    }

    public function formGuardar() {
        include __DIR__.'/../layouts/header.php';
        include __DIR__.'/../vista/usuario/formGuardar.php';
        include __DIR__.'/../layouts/footer.php';
    }

    public function buscar($id) {
        return (new Usuario())->buscar($id);
    }

    public function formEditar($id) {
        $u = (new Usuario())->buscar($id);
        include __DIR__.'/../layouts/header.php';
        include __DIR__.'/../vista/usuario/formEditar.php';
        include __DIR__.'/../layouts/footer.php';
    }

    public function actualizar($d) {
        (new Usuario())->actualizar($d);
        header('Location: index.php?c=Usuario&a=mostrar');
        exit;
    }

    public function eliminar($id) {
        (new Usuario())->eliminar($id);
        header('Location: index.php?c=Usuario&a=mostrar');
        exit;
    }
}
