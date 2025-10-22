const USERS_KEY = "users";
const CURRENT_KEY = "currentUser";

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function registerUser({ nombre, correo, contrasena, fechaNacimiento }) {
  const users = getUsers();
  const exists = users.find((u) => u.correo === correo);
  if (exists) {
    return { ok: false, error: "El correo ya está registrado" };
  }
  const user = { nombre, correo, contrasena, fechaNacimiento };
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
  return { ok: true, user };
}

export function login({ usuario, password }) {
  const users = getUsers();
  // usuario puede ser nombre o correo
  const found = users.find(
    (u) => u.correo === usuario || u.nombre === usuario
  );
  if (found && found.contrasena === password) {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(found));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(CURRENT_KEY);
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_KEY));
  } catch {
    return null;
  }
}