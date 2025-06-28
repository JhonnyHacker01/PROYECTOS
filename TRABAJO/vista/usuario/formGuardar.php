<h1>Registrar Usuario</h1>
<form method="post" action="index.php?c=Usuario&a=guardar">
  <div class="mb-2"><input name="username"   class="form-control" placeholder="Usuario" required></div>
  <div class="mb-2"><input name="password"   type="password" class="form-control" placeholder="Contraseña" required></div>
  <div class="mb-2"><input name="nombres"    class="form-control" placeholder="Nombres" required></div>
  <div class="mb-2"><input name="apellidos"  class="form-control" placeholder="Apellidos" required></div>
  <div class="mb-2"><input name="tipo"       class="form-control" placeholder="Tipo" required></div>
  <div class="mb-2"><input name="escuela"    class="form-control" placeholder="Escuela" required></div>
  <div class="mb-2"><input name="email"      type="email" class="form-control" placeholder="Email" required></div>
  <button class="btn btn-success">Guardar</button>
</form>
