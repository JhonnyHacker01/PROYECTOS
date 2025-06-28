<?php
// config/Conn.php
class Conn {
    private $dsn   = 'mysql:host=127.0.0.1;port=3306;dbname=libreria;charset=utf8mb4';
    private $user  = 'root';
    private $pass  = '';
    private $opts  = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ];
    public function conectar() {
        return new PDO($this->dsn, $this->user, $this->pass, $this->opts);
    }
}
