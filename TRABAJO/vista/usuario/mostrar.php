<?php /** @var array $Usuario */ ?>
<h1>Usuarios</h1>
<a href="index.php?c=Usuario&a=formGuardar" class="btn btn-primary mb-2">Nuevo Usuario</a>
<table class="table table-bordered">
  <thead>
    <tr>
      <th>ID</th><th>Usuario</th><th>Nombres</th><th>Apellidos</th>
      <th>Tipo</th><th>Escuela</th><th>Email</th><th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <?php foreach($Usuario as $u): ?>
    <tr>
      <td><?= $u['id'] ?></td>
      <td><?= htmlspecialchars($u['username']) ?></td>
      <td><?= htmlspecialchars($u['nombres']) ?></td>
      <td><?= htmlspecialchars($u['apellidos']) ?></td>
      <td><?= htmlspecialchars($u['tipo']) ?></td>
      <td><?= htmlspecialchars($u['escuela']) ?></td>
      <td><?= htmlspecialchars($u['email']) ?></td>
      <td>
        <a href="index.php?c=Usuario&a=formEditar&id=<?= $u['id'] ?>" class="btn btn-sm btn-info">Editar</a>
        <a href="index.php?c=Usuario&a=eliminar&id=<?= $u['id'] ?>" class="btn btn-sm btn-danger"
           onclick="return confirm('¿Eliminar usuario?')">Eliminar</a>
      </td>
    </tr>
    <?php endforeach; ?>
  </tbody>
</table>
