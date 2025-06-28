<?php /** @var array $u */ ?>
<h1>Editar Usuario</h1>
<form method="post" action="index.php?c=Usuario&a=actualizar">
  <input type="hidden" name="id" value="<?= $u['id'] ?>">
  <div class="mb-2"><input name="nombres"    class="form-control" value="<?= $u['nombres'] ?>" required></div>
  <div class="mb-2"><input name="apellidos"  class="form-control" value="<?= $u['apellidos'] ?>" required></div>
  <div class="mb-2"><input name="tipo"       class="form-control" value="<?= $u['tipo'] ?>" required></div>
  <div class="mb-2"><input name="escuela"    class="form-control" value="<?= $u['escuela'] ?>" required></div>
  <div class="mb-2"><input name="email"      type="email" class="form-control" value="<?= $u['email'] ?>" required></div>
  <button class="btn btn-primary">Actualizar</button>
</form>
