const state = {
  view: "dashboard",
  query: "",
  currentLoan: null,
  apiStatus: "Cargando API de ejemplo...",
  items: [
    {
      code: "DRA-001",
      name: "Clavos 1/2",
      category: "Material de apoyo",
      location: "Bodega A",
      status: "Disponible",
    },
    {
      code: "MIN-042",
      name: "Motor electrico",
      category: "Equipo tecnico",
      location: "Mesa 2",
      status: "Disponible",
    },
    {
      code: "SPL-071",
      name: "Pinza mecanica",
      category: "Equipo tecnico",
      location: "Panel 1",
      status: "Prestado",
    },
    {
      code: "SOL-001",
      name: "Soldadora",
      category: "Equipo tecnico",
      location: "Taller",
      status: "Prestado",
    },
    {
      code: "MUL-010",
      name: "Multimetro",
      category: "Equipo de medicion",
      location: "Gabinete",
      status: "Daniado",
    },
    {
      code: "TOR-090",
      name: "Tubo soldable",
      category: "Material de apoyo",
      location: "Bodega B",
      status: "Disponible",
    },
    {
      code: "EQP-065",
      name: "Equipo de sonido",
      category: "Equipo tecnico",
      location: "Audiovisuales",
      status: "Disponible",
    },
  ],
  loans: [
    {
      code: "CH-001",
      student: "Carlos Valdez",
      date: "13-06-26",
      item: "Clavos 1/2",
      state: "Pendiente",
    },
    {
      code: "MA-009",
      student: "Maria Andrade",
      date: "13-06-26",
      item: "Motor electrico",
      state: "Pendiente",
    },
    {
      code: "JP-007",
      student: "Javier Pinto",
      date: "13-06-26",
      item: "Multimetro",
      state: "Aprobado",
    },
    {
      code: "KA-060",
      student: "Karla Luna",
      date: "13-06-26",
      item: "Soldadora",
      state: "Aprobado",
    },
  ],
  returns: [
    {
      student: "Jimena Pacheco",
      item: "Pinza mecanica",
      code: "SPL-071",
      status: "En tiempo",
    },
    {
      student: "Carlos Ruiz",
      item: "Martillo",
      code: "MRT-009",
      status: "Retrasado",
    },
    {
      student: "Kevin Rivera",
      item: "Destornillador",
      code: "DST-120",
      status: "En tiempo",
    },
    {
      student: "Henry Vasquez",
      item: "Equipo OS",
      code: "EQP-065",
      status: "Revision",
    },
  ],
  users: [
    {
      name: "Andrea Lopez",
      email: "andrea@siptec.edu",
      role: "Admin",
      section: "2A",
      state: "Activo",
    },
    {
      name: "Marco Perez",
      email: "marco@siptec.edu",
      role: "Usuario",
      section: "2A",
      state: "Activo",
    },
    {
      name: "Sofia Mendez",
      email: "sofia@siptec.edu",
      role: "Usuario",
      section: "2B",
      state: "Activo",
    },
    {
      name: "Luis Rivas",
      email: "luis@siptec.edu",
      role: "Usuario",
      section: "2A",
      state: "Inactivo",
    },
  ],
  history: [
    {
      code: "CAA-120",
      item: "Cautin",
      start: "08-06-26",
      end: "09-06-26",
      user: "Brandon",
      status: "Disponible",
    },
    {
      code: "MRT-009",
      item: "Martillo",
      start: "10-06-26",
      end: "13-06-26",
      user: "Carlos",
      status: "Retrasado",
    },
    {
      code: "SOL-001",
      item: "Soldadora",
      start: "10-06-26",
      end: "13-06-26",
      user: "Karla",
      status: "Prestado",
    },
    {
      code: "EQP-065",
      item: "Equipo de sonido",
      start: "12-06-26",
      end: "13-06-26",
      user: "Henry",
      status: "Devuelto",
    },
  ],
};

const pageTemplates = {
  dashboard: `
    <h2>Bienvenido, Administrador</h2>
    <div id="apiStatus" class="api-note"></div>
    <div id="statsGrid" class="stat-grid"></div>
    <div class="dashboard-grid">
      <div class="panel">
        <p class="panel-title">Prestamos por semana</p>
        <div id="weeklyBars" class="chart-bars"></div>
      </div>
      <div class="panel">
        <p class="panel-title">Estado del inventario</p>
        <div class="pie-wrap">
          <div class="pie"></div>
          <div id="inventoryLegend" class="legend"></div>
        </div>
      </div>
    </div>
    <div class="panel mt-3">
      <p class="panel-title">Actividad reciente</p>
      <div id="recentActivity"></div>
    </div>
  `,
  inventory: `
    <div class="toolbar">
      <h2 class="m-0">Inventario</h2>
      <div>
        <button class="btn btn-dark btn-sm" data-filter="all"><i class="bi bi-funnel"></i> Todo</button>
        <button class="btn btn-success btn-sm" id="addItem"><i class="bi bi-plus-lg"></i> Agregar producto</button>
      </div>
    </div>
    <div class="table-wrap">
      <table class="sip-table">
        <thead><tr><th></th><th>Codigo</th><th>Nombre</th><th>Categoria</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody id="inventoryTable"></tbody>
      </table>
    </div>
  `,
  loans: `
    <h2>Prestamos</h2>
    <div class="loan-layout">
      <div class="table-wrap">
        <table class="sip-table">
          <thead><tr><th>Codigo</th><th>Nombre de usuario</th><th>Fecha inicio</th><th>Producto</th></tr></thead>
          <tbody id="loansTable"></tbody>
        </table>
      </div>
      <aside id="loanDetails" class="action-panel"></aside>
    </div>
  `,
  returns: `<h2>Devoluciones</h2><div id="returnsGrid" class="return-grid"></div>`,
  users: `
    <div class="toolbar">
      <h2 class="m-0">Usuarios</h2>
      <button class="btn btn-success btn-sm" data-user-add><i class="bi bi-person-plus"></i> Crear usuario</button>
    </div>
    <div class="table-wrap">
      <table class="sip-table">
        <thead><tr><th>Nombre</th><th>Correo electronico</th><th>Rol</th><th>Seccion</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody id="usersTable"></tbody>
      </table>
    </div>
  `,
  reports: `
    <h2>Reportes</h2>
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item"><button class="nav-link active">Historial de reportes pasados</button></li>
      <li class="nav-item"><button class="nav-link">Reportes generados</button></li>
    </ul>
    <div class="report-grid">
      ${[0, 1, 2, 3]
        .map(
          (index) => `
        <article class="data-card">
          <h3 data-report-title></h3>
          <p class="muted">Generado por Administrador. Incluye informacion resumida para seguimiento de inventario.</p>
          <button class="btn btn-primary btn-sm" data-export-report="${index}"><i class="bi bi-download"></i> Exportar</button>
          <button class="btn btn-outline-danger btn-sm" data-delete-card><i class="bi bi-trash"></i></button>
        </article>
      `,
        )
        .join("")}
    </div>
  `,
  history: `
    <div class="toolbar">
      <h2 class="m-0">Historial</h2>
      <button class="btn btn-success btn-sm" id="downloadHistory"><i class="bi bi-file-earmark-spreadsheet"></i> Exportar</button>
    </div>
    <div id="historyTable" class="table-wrap"></div>
  `,
  settings: `
    <h2>Configuracion</h2>
    <div class="settings-box">
      <div>
        <label class="form-label">Nombre de Usuario</label>
        <input class="form-control mb-3" value="Usuario">
        <label class="form-label">Apellido del Usuario</label>
        <input class="form-control mb-3" value="Castaneda">
        <button class="btn btn-dark" data-save-settings>Guardar Cambios</button>
      </div>
      <div class="settings-divider"></div>
      <div>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="themeSwitch">
          <label class="form-check-label" for="themeSwitch">Apariencia</label>
        </div>
        <button class="btn btn-outline-dark mt-5" data-logout>Cerrar Sesion <i class="bi bi-box-arrow-right"></i></button>
      </div>
    </div>
  `,
};

const root = document.querySelector("#viewRoot");
const loginScreen = document.querySelector("#loginScreen");
const appShell = document.querySelector("#appShell");
const itemModal = new bootstrap.Modal("#itemModal");
const userModal = new bootstrap.Modal("#userModal");
const API_FALLBACK_ORIGIN = "http://localhost:4174";
const THEME_STORAGE_KEY = "siptec-theme";
document.querySelector("#dateText").textContent = new Intl.DateTimeFormat(
  "es-GT",
  {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
).format(new Date());

document.querySelector("#loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();
  document
    .querySelector("#loginError")
    .classList.toggle("d-none", Boolean(email && password));
  if (!email || !password) return;
  loginScreen.classList.add("d-none");
  appShell.classList.remove("d-none");
  loadExampleApiData();
  render();
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    document
      .querySelectorAll(".nav-item")
      .forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});

document.querySelector("#globalSearch").addEventListener("input", (event) => {
  state.query = event.target.value.toLowerCase();
  render();
});

document.querySelector("#refreshBtn").addEventListener("click", () => {
  toast("Datos actualizados correctamente.");
  render();
});

document.querySelector("#itemForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.items.unshift({
    code: document.querySelector("#itemCode").value.trim(),
    name: document.querySelector("#itemName").value.trim(),
    category: document.querySelector("#itemCategory").value,
    location: document.querySelector("#itemLocation").value.trim(),
    status: "Disponible",
  });
  event.target.reset();
  document.querySelector("#itemLocation").value = "Bodega tecnica";
  itemModal.hide();
  toast("Herramienta registrada.");
  render();
});

document
  .querySelector("#userForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = event.submitter;
    submitButton.disabled = true;

    try {
      const user = await apiFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: document.querySelector("#userFirstName").value,
          lastName: document.querySelector("#userLastName").value,
          email: document.querySelector("#userEmail").value,
          role: document.querySelector("#userRole").value,
          institution: document.querySelector("#userInstitution").value,
          password: document.querySelector("#userPassword").value,
        }),
      });

      state.users.push(toUiUser(user));
      event.target.reset();
      userModal.hide();
      toast("Usuario creado y guardado en la base de datos.");
      if (state.view === "users") render();
    } catch (error) {
      toast(error.message || "No se pudo crear el usuario.");
    } finally {
      submitButton.disabled = false;
    }
  });

async function render() {
  root.innerHTML = await loadPage(state.view);
  hydrateView();
  bindViewEvents();
}

async function loadPage(view) {
  try {
    const response = await fetch(`pages/${view}.html`, { cache: "no-store" });
    if (!response.ok) throw new Error(`No se encontro pages/${view}.html`);
    return await response.text();
  } catch (error) {
    return (
      pageTemplates[view] ||
      `<div class="alert alert-warning">No se encontro la pagina solicitada.</div>`
    );
  }
}

async function loadExampleApiData() {
  if (state.apiLoaded) return;
  state.apiLoaded = true;

  try {
    const [productsResponse, dbUsers] = await Promise.all([
      fetch("https://dummyjson.com/products?limit=7"),
      loadUsersFromDatabase(),
    ]);
    if (!productsResponse.ok) throw new Error("API de productos no disponible");

    const productsData = await productsResponse.json();

    state.items = productsData.products.map((product, index) => ({
      code: `API-${String(product.id).padStart(3, "0")}`,
      name: product.title,
      category: index % 2 === 0 ? "Equipo tecnico" : "Material de apoyo",
      location: product.brand || "Bodega tecnica",
      status: ["Disponible", "Prestado", "Daniado"][index % 3],
    }));

    state.users = dbUsers;

    state.loans = state.users.slice(1, 5).map((user, index) => ({
      code: `PR-${String(index + 1).padStart(3, "0")}`,
      student: user.name,
      date: "20-06-26",
      item: state.items[index]?.name || "Herramienta",
      state: index < 2 ? "Pendiente" : "Aprobado",
    }));

    state.returns = state.loans.map((loan, index) => ({
      student: loan.student,
      item: loan.item,
      code: state.items[index]?.code || loan.code,
      status: ["En tiempo", "Retrasado", "En tiempo", "Revision"][index],
    }));

    state.history = state.items.slice(0, 5).map((item, index) => ({
      code: item.code,
      item: item.name,
      start: "18-06-26",
      end: "20-06-26",
      user: state.users[index]?.name || "Usuario",
      status: item.status,
    }));

    state.currentLoan = null;
    state.apiStatus =
      "Inventario cargado desde DummyJSON y usuarios desde SQLite.";
    render();
  } catch (error) {
    try {
      state.users = await loadUsersFromDatabase();
      state.apiStatus =
        "Usuarios conectados a SQLite. Inventario usando datos locales.";
    } catch {
      state.apiStatus =
        "Usando datos locales porque la API o la base de datos no respondio.";
    }
    render();
  }
}

async function loadUsersFromDatabase() {
  const users = await apiFetch("/api/users");
  return users.map(toUiUser);
}

async function apiFetch(path, options = {}) {
  const origins =
    location.protocol === "file:"
      ? [API_FALLBACK_ORIGIN]
      : ["", API_FALLBACK_ORIGIN];

  let lastError;
  for (const origin of origins) {
    try {
      const response = await fetch(`${origin}${path}`, options);
      const data = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(data.error || "Error al conectar con la API.");
      return data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

function toUiUser(user) {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    section: user.institution,
    state: user.active ? "Activo" : "Inactivo",
  };
}

function hydrateView() {
  const hydrators = {
    dashboard: hydrateDashboard,
    inventory: hydrateInventory,
    loans: hydrateLoans,
    returns: hydrateReturns,
    users: hydrateUsers,
    reports: hydrateReports,
    history: hydrateHistory,
    settings: hydrateSettings,
  };
  hydrators[state.view]?.();
}

function hydrateDashboard() {
  const available = state.items.filter(
    (item) => item.status === "Disponible",
  ).length;
  const borrowed = state.items.filter(
    (item) => item.status === "Prestado",
  ).length;
  const pending = state.loans.filter(
    (loan) => loan.state === "Pendiente",
  ).length;
  const apiStatus = document.querySelector("#apiStatus");
  if (apiStatus) apiStatus.textContent = state.apiStatus;
  document.querySelector("#statsGrid").innerHTML = [
    stat("Herramientas", state.items.length, "bi-box-seam", "#1aa6ff"),
    stat("Disponibles", available, "bi-check2-circle", "#35bd60"),
    stat("Prestamos", borrowed, "bi-arrow-left-right", "#ff9e1b"),
    stat("Solicitudes", pending, "bi-bell", "#a064ff"),
  ].join("");
  document.querySelector("#weeklyBars").innerHTML = [38, 72, 64, 82, 55, 44, 30]
    .map((value) => `<div class="bar" style="height:${value}%">${value}</div>`)
    .join("");
  document.querySelector("#inventoryLegend").innerHTML = `
    <span><i class="dot" style="background:var(--blue)"></i>Disponible ${available}</span>
    <span><i class="dot" style="background:#33c24d"></i>Prestado ${borrowed}</span>
    <span><i class="dot" style="background:#ffdd28"></i>Daniado ${state.items.length - available - borrowed}</span>
  `;
  document.querySelector("#recentActivity").innerHTML = historyTable(
    state.history.slice(0, 4),
  );
}

function getStoredTheme() {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme === "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  const themeSwitch = document.querySelector("#themeSwitch");
  if (themeSwitch) {
    themeSwitch.checked = isDark;
  }
  window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
}

function syncThemeControl() {
  const themeSwitch = document.querySelector("#themeSwitch");
  if (themeSwitch) {
    themeSwitch.checked = document.body.classList.contains("dark-mode");
  }
}

applyTheme(getStoredTheme());

function hydrateInventory() {
  document.querySelector("#inventoryTable").innerHTML = filterRows(state.items)
    .map(itemRow)
    .join("");
}

function hydrateLoans() {
  const selected =
    state.currentLoan ||
    state.loans.find((loan) => loan.state === "Pendiente") ||
    state.loans[0];
  document.querySelector("#loansTable").innerHTML = filterRows(state.loans)
    .map(
      (loan) => `
    <tr role="button" data-select-loan="${loan.code}">
      <td>${loan.code}</td><td>${loan.student}</td><td>${loan.date}</td><td>${loan.item}</td>
    </tr>
  `,
    )
    .join("");
  document.querySelector("#loanDetails").innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <strong>Prestamo</strong>
      <span class="${statusClass(selected.state)}">${selected.state}</span>
    </div>
    <p class="muted mb-1">Descripcion</p>
    <div class="bg-white rounded p-3 mb-3 text-dark">${selected.student} solicita ${selected.item}.</div>
    <p class="muted mb-1">Estado del material</p>
    <strong>${selected.state}</strong>
    <div class="d-grid gap-2 mt-4">
      <button class="btn btn-success" data-loan-action="Aprobado" data-code="${selected.code}"><i class="bi bi-check-lg"></i> Aprobar Prestamo</button>
      <button class="btn btn-danger" data-loan-action="Rechazado" data-code="${selected.code}"><i class="bi bi-x-lg"></i> Rechazar Prestamo</button>
    </div>
  `;
}

function hydrateReturns() {
  document.querySelector("#returnsGrid").innerHTML = state.returns
    .map(
      (item, index) => `
    <article class="data-card">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="${statusClass(item.status)}">${item.status}</span>
        <small class="muted">solicitado: revisar</small>
      </div>
      <h3>${item.student}</h3>
      <p class="mb-1"><i class="bi bi-box"></i> ${item.item}</p>
      <p class="muted">${item.code}</p>
      <button class="btn btn-success btn-sm" data-return="${index}">Devuelto</button>
      <button class="btn btn-warning btn-sm" data-report-return="${index}">Reportar dano</button>
    </article>
  `,
    )
    .join("");
}

function hydrateUsers() {
  document.querySelector("#usersTable").innerHTML = filterRows(state.users)
    .map(
      (user, index) => `
    <tr>
      <td>${user.name}</td><td>${user.email}</td><td>${user.role}</td><td>${user.section}</td>
      <td><span class="${statusClass(user.state)}">${user.state}</span></td>
      <td><button class="icon-btn" data-toggle-user="${index}" title="Cambiar estado"><i class="bi bi-pencil"></i></button></td>
    </tr>
  `,
    )
    .join("");
}

function hydrateReports() {
  document.querySelectorAll("[data-report-title]").forEach((element, index) => {
    const titles = [
      "Herramientas mas usadas",
      "Fecha de reporte: 13/06/2026",
      "Descripcion: herramientas danadas",
      "Reporte de prestamos activos",
    ];
    element.textContent = titles[index];
  });
}

function hydrateHistory() {
  syncThemeControl();
}

function hydrateSettings() {
  document.querySelector("#themeSwitch").checked =
    document.body.classList.contains("dark-mode");
}

document
  .querySelector("#themeSwitch")
  ?.addEventListener("change", (event) => applyTheme(event.target.checked));

function bindViewEvents() {
  document
    .querySelector("#addItem")
    ?.addEventListener("click", () => itemModal.show());

  document.querySelectorAll("[data-item-status]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = state.items[Number(button.dataset.itemStatus)];
      const order = ["Disponible", "Prestado", "Daniado"];
      item.status = order[(order.indexOf(item.status) + 1) % order.length];
      toast("Estado de herramienta actualizado.");
      render();
    });
  });

  document.querySelectorAll("[data-item-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      state.items.splice(Number(button.dataset.itemRemove), 1);
      toast("Herramienta eliminada.");
      render();
    });
  });

  document.querySelectorAll("[data-select-loan]").forEach((row) => {
    row.addEventListener("click", () => {
      state.currentLoan = state.loans.find(
        (loan) => loan.code === row.dataset.selectLoan,
      );
      render();
    });
  });

  document.querySelectorAll("[data-loan-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const loan = state.loans.find(
        (item) => item.code === button.dataset.code,
      );
      loan.state = button.dataset.loanAction;
      state.currentLoan = loan;
      toast(`Prestamo ${loan.state.toLowerCase()}.`);
      render();
    });
  });

  document.querySelectorAll("[data-return]").forEach((button) => {
    button.addEventListener("click", () => {
      state.returns.splice(Number(button.dataset.return), 1);
      toast("Devolucion registrada.");
      render();
    });
  });

  document.querySelectorAll("[data-report-return]").forEach((button) => {
    button.addEventListener("click", () => {
      state.returns[Number(button.dataset.reportReturn)].status = "Revision";
      toast("Dano reportado para revision.");
      render();
    });
  });

  document.querySelectorAll("[data-toggle-user]").forEach((button) => {
    button.addEventListener("click", async () => {
      const user = state.users[Number(button.dataset.toggleUser)];
      try {
        const updated = await apiFetch(`/api/users/${user.id}/toggle`, {
          method: "PATCH",
        });
        state.users[Number(button.dataset.toggleUser)] = toUiUser(updated);
        toast("Estado de usuario actualizado en la base de datos.");
        render();
      } catch (error) {
        toast(error.message || "No se pudo actualizar el usuario.");
      }
    });
  });

  document.querySelector("[data-user-add]")?.addEventListener("click", () => {
    userModal.show();
  });

  document.querySelectorAll("[data-delete-card]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".data-card").remove();
      toast("Reporte eliminado.");
    });
  });

  document.querySelectorAll("[data-export-report]").forEach((button) => {
    button.addEventListener("click", () =>
      downloadText(
        `reporte-${button.dataset.exportReport}.txt`,
        "Reporte SIPTEC generado correctamente.",
      ),
    );
  });

  document.querySelector("#downloadHistory")?.addEventListener("click", () => {
    const csv = [
      "codigo,herramienta,inicio,entrega,usuario,estado",
      ...state.history.map((row) => Object.values(row).join(",")),
    ].join("\n");
    downloadText("historial-siptec.csv", csv);
  });

  document
    .querySelector("[data-save-settings]")
    ?.addEventListener("click", () => toast("Configuracion guardada."));
  document
    .querySelector("#themeSwitch")
    ?.addEventListener("change", (event) =>
      document.body.classList.toggle("dark-mode", event.target.checked),
    );
  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    appShell.classList.add("d-none");
    loginScreen.classList.remove("d-none");
  });
}

function stat(label, value, icon, color) {
  return `
    <article class="stat-card">
      <div class="stat-icon" style="background:${color}"><i class="bi ${icon}"></i></div>
      <div><strong>${value}</strong><span>${label}</span></div>
    </article>
  `;
}

function itemRow(item, index) {
  return `
    <tr>
      <td><i class="bi bi-${item.category.includes("Equipo") ? "cpu-fill" : "hammer"}"></i></td>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td><span class="${statusClass(item.status)}">${item.status}</span></td>
      <td>
        <button class="icon-btn" data-item-status="${index}" title="Cambiar estado"><i class="bi bi-pencil"></i></button>
        <button class="icon-btn" data-item-remove="${index}" title="Eliminar"><i class="bi bi-trash"></i></button>
      </td>
    </tr>
  `;
}

function historyTable(rows) {
  return `
    <table class="sip-table">
      <thead><tr><th>Codigo</th><th>Herramienta</th><th>Inicio</th><th>Entrega</th><th>Usuario</th><th>Estado</th></tr></thead>
      <tbody>${rows
        .map(
          (row) => `
        <tr><td>${row.code}</td><td>${row.item}</td><td>${row.start}</td><td>${row.end}</td><td>${row.user}</td><td><span class="${statusClass(row.status)}">${row.status}</span></td></tr>
      `,
        )
        .join("")}</tbody>
    </table>
  `;
}

function statusClass(status) {
  const normalized = status.toLowerCase();
  const type =
    normalized.includes("disponible") ||
    normalized.includes("activo") ||
    normalized.includes("devuelto") ||
    normalized.includes("tiempo")
      ? "available"
      : normalized.includes("pendiente") ||
          normalized.includes("prestado") ||
          normalized.includes("revision") ||
          normalized.includes("retrasado")
        ? "borrowed"
        : "damage";
  return `status ${type}`;
}

function filterRows(rows) {
  if (!state.query) return rows;
  return rows.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(state.query),
  );
}

function toast(message) {
  const host = document.querySelector("#toastHost");
  const node = document.createElement("div");
  node.className = "toast align-items-center text-bg-dark border-0";
  node.role = "alert";
  node.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button></div>`;
  host.appendChild(node);
  const instance = new bootstrap.Toast(node, { delay: 2200 });
  instance.show();
  node.addEventListener("hidden.bs.toast", () => node.remove());
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
  toast("Archivo generado.");
}
