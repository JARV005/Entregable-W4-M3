const MAX_INTERACTIONS = 5;

// Obtener el número actual de interacciones
function getInteractionCount() {
  return parseInt(localStorage.getItem("interactions")) || 0;
}

// Incrementar contador y verificar límite
function incrementInteractions() {
  let count = getInteractionCount();
  count++;
  localStorage.setItem("interactions", count);
  updateInteractionDisplay();

  if (count >= MAX_INTERACTIONS) {
    blockSystem();
  }
}

// Mostrar el contador en pantalla
function updateInteractionDisplay() {
  const counter = document.getElementById("interaction_count");
  const count = getInteractionCount();
  counter.textContent = `Interacciones: ${count} / ${MAX_INTERACTIONS}`;
}

// Bloquear el sistema si se supera el límite
function blockSystem() {
  const showInfo = document.getElementById("info_user");
  showInfo.textContent = "Se superó la capacidad del sistema.";

  document.getElementById("info_button").disabled = true;

  document.querySelectorAll(".btn-danger").forEach(btn => {
    btn.disabled = true;
  });
}

// Guardar nuevo usuario
function info() {
  if (getInteractionCount() >= MAX_INTERACTIONS) {
    blockSystem();
    return;
  }

  const nameInput = document.getElementById("name");
  const ageInput = document.getElementById("age");
  const name = nameInput.value.trim();
  const age = ageInput.value.trim();

  if (!name || !age) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push({ name, age });
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("info_user").textContent = `Hola ${name}, tienes ${age} años.`;

  nameInput.value = "";
  ageInput.value = "";

  incrementInteractions();
  displayUsers();
}

// Mostrar usuarios
function displayUsers() {
  const usersList = document.getElementById("user_list");
  usersList.innerHTML = "";

  const users = JSON.parse(localStorage.getItem("users")) || [];

  users.forEach((user, index) => {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between align-items-center";

    const isDisabled = getInteractionCount() >= MAX_INTERACTIONS ? 'disabled' : '';

    listItem.innerHTML = `
      ${user.name}, ${user.age} años
      <button class="btn btn-sm btn-danger" onclick="deleteUser(${index})" ${isDisabled}>Eliminar</button>
    `;

    usersList.appendChild(listItem);
  });
}

// Eliminar usuario
function deleteUser(index) {
  if (getInteractionCount() >= MAX_INTERACTIONS) {
    blockSystem();
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));

  incrementInteractions();
  displayUsers();
}

// Reiniciar todo
function resetSystem() {
  localStorage.clear();
  document.getElementById("info_user").textContent = "";
  document.getElementById("info_button").disabled = false;
  displayUsers();
  updateInteractionDisplay();
}

// Eventos iniciales
window.onload = function () {
  displayUsers();
  updateInteractionDisplay();

  if (getInteractionCount() >= MAX_INTERACTIONS) {
    blockSystem();
  }

  document.getElementById("info_button").addEventListener("click", info);
  document.getElementById("reset_button").addEventListener("click", resetSystem);
};
