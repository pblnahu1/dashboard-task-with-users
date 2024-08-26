export class UserManager {
  constructor() {
    this.usuarios = [];
    this.editarUsuariosId = null;
  }

  async agregarEditarUsuarios(username, email) {
    if (this.editarUsuariosId !== null) {
      const usuario = this.usuarios.find(usuario => usuario.id === this.agregarEditarUsuarios);
      if (usuario) {
        usuario.username = username;
        usuario.email = email;
      }
      this.editarUsuariosId = null;
    } else {
      const usuario = {
        id: this.usuarios.length + 1,
        username,
        email
      };
      this.usuarios.push(usuario);
    }

    await this.guardarUsuarios();
    this.renderUsuarios();
  }

  borrarUsuario(id) {
    this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
  }

  editarUsuario(id) {
    const usuario = this.usuarios.find(usuario => usuario.id === id);
    if (usuario) {
      document.getElementById('username').value = usuario.username;
      document.getElementById('email').value = usuario.email;
      this.editarUsuariosId = id;
    }
  }

  renderUsuarios() {
    const listaDeUsuarios = document.getElementById('users');
    listaDeUsuarios.innerHTML = '';
    this.usuarios.forEach(({ id, username, email }) => {
      const itemUsuarios = document.createElement('li');
      itemUsuarios.textContent = `Username: ${username}, Email: ${email}`;
      
      const botonEditar = document.createElement("button");
      botonEditar.textContent = "Editar";
      botonEditar.addEventListener("click", () => this.editarUsuario(id));

      const botonBorrar = document.createElement("button");
      botonBorrar.textContent = "Borrar";
      botonBorrar.addEventListener("click", () => {
        this.borrarUsuario(id);
        this.renderUsuarios();
      });

      itemUsuarios.appendChild(botonEditar);
      itemUsuarios.appendChild(botonBorrar);
      listaDeUsuarios.appendChild(itemUsuarios);
    });
  }

  async guardarUsuarios() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Users saved");
        resolve();
      }, 500);
    });
  }

  async cargarUsuarios() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Users loaded");
        resolve(this.usuarios);
      }, 500);
    });
  }
}