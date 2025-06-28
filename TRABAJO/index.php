<?php
// index.php

session_start();

// 1) Carga la configuración de PDO
require_once 'config/Conn.php';

// 2) Auto-carga de modelos y controladores
foreach (glob("modelos/*.php")    as $file) require_once $file;
foreach (glob("controlador/*.php") as $file) require_once $file;

// 3) Determina el controlador (c) y la acción (a)
$c = $_GET['c'] ?? 'Cliente';           // Por defecto Cliente
$a = $_GET['a'] ?? 'mostrar';          // Por defecto mostrar

// 4) Parámetros para la acción
//    - Si es POST, pasamos $_POST completo
//    - Si es GET con id, pasamos el id
$params = $_SERVER['REQUEST_METHOD'] === 'POST'
    ? $_POST
    : (isset($_GET['id']) ? $_GET['id'] : null);

// 5) Instancia el controller y ejecuta la acción
$controllerClass = $c . 'Controller';
if (!class_exists($controllerClass)) {
    die("Controlador <strong>$controllerClass</strong> no existe.");
}
$ctrl = new $controllerClass();

// Si la acción devuelve redirección (headers enviados), detenemos
$result = $ctrl->{$a}($params);

// 6) Renderiza la vista
require 'layouts/header.php';

$viewFile = __DIR__ . "/vista/" . strtolower($c) . "/$a.php";
if (file_exists($viewFile)) {
    // Hace disponible la variable con el nombre del controlador
    // p.ej. $Cliente, $Usuario, $Pedido...
    $$c = $result;
    include $viewFile;
} else {
    // Si no hay vista, vuelca el resultado para depurar
    echo '<pre>'; var_dump($result); echo '</pre>';
}

require 'layouts/footer.php';

