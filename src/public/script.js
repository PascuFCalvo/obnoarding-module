console.log("script.js ha sido cargado correctamente");

let currentUser = null;
let currentDocument = null;
const signaturePad = new SignaturePad(document.getElementById("signaturePad"));

function resetUI() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("managerArea").classList.add("hidden");
  document.getElementById("workerArea").classList.add("hidden");
  document.getElementById("pdfViewer").classList.add("hidden");
  document.getElementById("saveSignature").classList.add("hidden");
  document.getElementById("logoutBtn").classList.add("hidden");
  signaturePad.clear();
  currentUser = null;
  currentDocument = null;
}

// Cargar departamentos para el manager
async function loadDepartments() {
  const response = await fetch(
    "http://localhost:3000/workers/workerDepartments"
  );
  const data = await response.json();

  const departmentSelect = document.getElementById("department");
  departmentSelect.innerHTML = ""; // Limpiar opciones anteriores
  const defaultOption = document.createElement("option");
  defaultOption.value = "general";
  defaultOption.text = "General";
  departmentSelect.appendChild(defaultOption);
  data.departments.forEach((department) => {
    const option = document.createElement("option");
    option.value = department;
    option.text = department;
    departmentSelect.appendChild(option);
  });
}
const buttonVerEmpleados = document.getElementById("toggleWorkers");

async function toggleWorkers() {
  let workerList = document.getElementById("workerList");
  let workerDocuments = document.getElementById("workerDocuments");
  let buttonVerEmpleados = document.getElementById("toggleWorkers"); // Asegúrate de definir el botón aquí

  if (workerList.style.display === "none" || !workerList.style.display) {
    workerList.style.display = "block";
    workerDocuments.style.display = "block";
    buttonVerEmpleados.innerHTML = "Ocultar empleados";
  } else {
    workerList.style.display = "none";
    workerDocuments.style.display = "none";
    buttonVerEmpleados.innerHTML = "Ver empleados";
  }
}

buttonVerEmpleados.addEventListener("click", toggleWorkers);

async function clearSignature() {
  let name = document.getElementById("name");
  name.value = "";
  let dni = document.getElementById("DNI");
  dni.value = "";
  signaturePad.clear();
}
let clearSignatureButton = document.getElementById("clearSignature");
clearSignatureButton.addEventListener("click", clearSignature);

// Cargar bloques
async function loadBlocks() {
  const response = await fetch("http://localhost:3000/managers/blocks");
  const data = await response.json();

  const blockSelect = document.getElementById("block");
  blockSelect.innerHTML = ""; // Limpiar opciones anteriores

  if (Array.isArray(data.blocks)) {
    data.blocks.forEach((block) => {
      const option = document.createElement("option");
      option.value = block; // Asigna el valor del bloque
      option.text = block; // Asigna el texto que se mostrará
      blockSelect.appendChild(option); // Añadir la opción al select
    });
  }

  return data.blocks;
}

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
      currentUser = data.user;
      alert(`Login exitoso. Bienvenido, ${currentUser.name}`);
      document.getElementById("loginForm").classList.add("hidden");
      document.getElementById("logoutBtn").classList.remove("hidden");

      if (currentUser.role === "manager") {
        document.getElementById("managerArea").classList.remove("hidden");
        loadDepartments();
        loadBlocks();
        loadWorkerList();
        loadSocietyDocuments();
      } else if (currentUser.role === "worker") {
        document.getElementById("workerArea").classList.remove("hidden");
        loadDocumentsForWorker();
        loadSignedDocumentsForWorker();
      }
    } else {
      alert("Login fallido: " + data.message);
    }
  });

// Logout del usuario
document.getElementById("logoutBtn").addEventListener("click", function () {
  alert("Has cerrado sesión correctamente.");
  resetUI();
});

// Subida de documentos para el manager
document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Obtener valores del formulario
    const documentFile = document.getElementById("document").files[0];
    const societyId = currentUser.societyId; // Suponiendo que tienes el id de la sociedad en currentUser
    const department = document.getElementById("department").value; // Obtener departamento
    const block = document.getElementById("block").value; // Obtener bloque

    // Enviar información de la sociedad, departamento y bloque
    const infoResponse = await fetch(
      "http://localhost:3000/documents/upload-info",
      {
        method: "POST",
        body: JSON.stringify({ societyId, department, block }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!infoResponse.ok) {
      const infoData = await infoResponse.json();
      alert(
        "Error al enviar la información de sociedad, departamento y bloque: " +
          infoData.message
      );
      return; // Detener si falla
    }

    // Subir el archivo
    const fileFormData = new FormData();
    fileFormData.append("document", documentFile);
    const fileResponse = await fetch(
      "http://localhost:3000/documents/upload-file",
      {
        method: "POST",
        body: fileFormData,
      }
    );

    const fileData = await fileResponse.json();
    if (fileResponse.ok) {
      alert("Documento subido correctamente.");
      loadSocietyDocuments();
    } else {
      alert("Error al subir el documento: " + fileData.message);
    }
  });

// Cargar lista de trabajadores para el manager
async function loadWorkerList() {
  const workerList = document.getElementById("workerList");

  // Verifica que el elemento exista antes de continuar
  if (!workerList) {
    console.error("No se encuentra el elemento 'workerList'.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/workers/manager/worker-list/${currentUser.id}`
    );
    const data = await response.json();

    workerList.innerHTML = "";

    data.workers.forEach((worker) => {
      const workerItem = document.createElement("div");
      workerItem.innerHTML = `<strong>${worker.name}</strong>`;
      workerItem.style.cursor = "pointer";
      let documentsByWorker = document.getElementById("documentsByWorker");
      workerItem.addEventListener("click", () => {
        documentsByWorker.classList.remove("hidden");
        loadWorkerDocuments(worker.id);
      });

      workerList.appendChild(workerItem);
    });
  } catch (error) {
    console.error("Error al cargar la lista de trabajadores:", error);
  }
}

// Cargar documentos firmados por el trabajador seleccionado (manager)
async function loadWorkerDocuments(workerId) {
  const response = await fetch(
    `http://localhost:3000/workers/manager/worker-documents/${currentUser.id}/${workerId}`
  );
  const data = await response.json();
  console.log(data); // Para depurar y ver la respuesta

  const documentsByWorkerContainer =
    document.getElementById("documentsByWorker");
  documentsByWorkerContainer.innerHTML = ""; // Limpiar contenido anterior

  // Verificar si hay documentos
  if (!data.documents || data.documents.length === 0) {
    documentsByWorkerContainer.innerHTML =
      "<p>No hay documentos disponibles.</p>";
    return;
  }

  // Agrupar documentos por departamento y bloque
  const groupedDocuments = {};

  data.documents.forEach((doc) => {
    const { department, block } = doc; // Asegúrate de que el objeto doc tiene estas propiedades

    // Asegurarse de que la estructura existe
    if (!groupedDocuments[department]) {
      groupedDocuments[department] = {};
    }
    if (!groupedDocuments[department][block]) {
      groupedDocuments[department][block] = [];
    }

    // Añadir el documento al grupo correspondiente
    groupedDocuments[department][block].push(doc);
  });

  // Iterar sobre cada departamento en la estructura agrupada
  for (const department in groupedDocuments) {
    const departmentHeader = document.createElement("h2");
    departmentHeader.textContent = department; // Nombre del departamento
    documentsByWorkerContainer.appendChild(departmentHeader);

    // Iterar sobre cada bloque dentro del departamento
    for (const block in groupedDocuments[department]) {
      const blockHeader = document.createElement("h3");
      blockHeader.textContent = block; // Nombre del bloque
      documentsByWorkerContainer.appendChild(blockHeader);

      const ul = document.createElement("ul"); // Lista de documentos del bloque

      groupedDocuments[department][block].forEach((doc) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${doc.filePath}" download>${doc.fileName} </a>`;
        ul.appendChild(li); // Añadir documento a la lista
      });

      documentsByWorkerContainer.appendChild(ul); // Añadir la lista de documentos al bloque
    }
  }
}

// Cargar documentos subidos por el manager para el trabajador
async function loadDocumentsForWorker() {
  const response = await fetch(
    `http://localhost:3000/documents/documents/${currentUser.id}`
  );
  const data = await response.json();

  const documentList = document.getElementById("documentList");
  documentList.innerHTML = ""; // Limpiar la lista de documentos

  // Iterar sobre cada departamento
  for (const department in data.documents) {
    const departmentHeader = document.createElement("h2");
    departmentHeader.textContent = department; // Nombre del departamento
    documentList.appendChild(departmentHeader);

    // Iterar sobre cada bloque dentro del departamento
    for (const block in data.documents[department]) {
      const blockHeader = document.createElement("h3");
      blockHeader.textContent = block; // Nombre del bloque
      documentList.appendChild(blockHeader);

      const ul = document.createElement("ul"); // Lista de documentos del bloque

      data.documents[department][block].forEach((doc) => {
        const li = document.createElement("li");
        li.innerHTML = `<span style="cursor:pointer">${doc.fileName}</span>`;
        li.addEventListener("click", () => {
          const signDocumentContainer = document.getElementById(
            "signDocumentContainer"
          );
          signDocumentContainer.classList.remove("hidden");
          currentDocument = doc.fileName;
          previewDocument(doc.filePath); // Asegúrate de que doc.filePath sea la ruta correcta
        });
        ul.appendChild(li); // Añadir documento a la lista
      });

      documentList.appendChild(ul); // Añadir la lista de documentos al bloque
    }
  }
}

let buttonClosePreview = document.getElementById("closePreview");
buttonClosePreview.addEventListener("click", function () {
  document.getElementById("signDocumentContainer").classList.add("hidden");
});

// Previsualizar el documento
function previewDocument(documentUrl) {
  const pdfViewer = document.getElementById("pdfViewer");
  pdfViewer.src = documentUrl; // La URL debe ser válida y accesible
  pdfViewer.classList.remove("hidden");

  document.getElementById("saveSignature").classList.remove("hidden");
}

// Guardar la firma en el documento
document
  .getElementById("saveSignature")
  .addEventListener("click", async function () {
    if (signaturePad.isEmpty()) {
      alert("Por favor, añade una firma.");
      return;
    }

    const name = document.getElementById("name").value;
    const dni = document.getElementById("DNI").value;

    if (!name || !dni) {
      alert("Por favor, introduce tu nombre y DNI.");
      return;
    }

    const signatureDataUrl = signaturePad.toDataURL();
    const formData = {
      workerId: currentUser.id,
      documentName: currentDocument,
      signatureDataUrl: signatureDataUrl,
      name: name,
      DNI: dni,
      date: new Date().toLocaleDateString(),
    };

    const response = await fetch(
      "http://localhost:3000/documents/sign-document",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      alert("Documento firmado correctamente.");
      document.getElementById("pdfViewer").src = data.filePath; // Muestra el documento firmado

      document.getElementById("saveSignature").classList.add("hidden");
      signaturePad.clear();
      loadDocumentsForWorker(); // Actualiza la lista de documentos
      loadSignedDocumentsForWorker(); // Actualiza la lista de documentos firmados
    } else {
      alert("Error al firmar el documento.");
    }
  });

// Cargar documentos firmados por el trabajador
async function loadSignedDocumentsForWorker() {
  const response = await fetch(
    `http://localhost:3000/documents/worker/signed-documents/${currentUser.id}`
  );
  const data = await response.json();

  const signedDocumentList = document.getElementById("signedDocumentList");
  signedDocumentList.innerHTML = ""; // Limpiar la lista de documentos firmados

  // Iterar sobre cada departamento en la respuesta
  for (const department in data.signedDocuments) {
    // Iterar sobre cada bloque dentro del departamento
    for (const block in data.signedDocuments[department]) {
      // const blockHeader = document.createElement("h3");
      // blockHeader.textContent = block; // Nombre del bloque
      // signedDocumentList.appendChild(blockHeader);

      const ul = document.createElement("ul"); // Lista de documentos del bloque

      data.signedDocuments[department][block].forEach((doc) => {
        const li = document.createElement("li");
        const check = document.createElement("p");
        check.innerHTML = `✅`;

        li.innerHTML = `<a href="${doc.filePath}" download>${doc.fileName}</a>`;
        li.appendChild(check);
        ul.appendChild(li); // Añadir documento a la lista
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
      });

      signedDocumentList.appendChild(ul); // Añadir la lista de documentos al bloque
    }
  }
}

// Cargar documentos subidos por el manager para mostrar en "Documentos de la Sociedad"
async function loadSocietyDocuments() {
  const response = await fetch(
    `http://localhost:3000/documents/society-documents/${currentUser.societyId}`
  );

  const data = await response.json();
  const documentsBySocietyContainer =
    document.getElementById("documentsBySociety");
  documentsBySocietyContainer.innerHTML = "";

  // Estructura de documentos
  for (const department in data.documents) {
    const departmentContainer = document.createElement("div");
    departmentContainer.classList.add("departmentContainer");

    const departmentHeader = document.createElement("h2");
    departmentHeader.classList.add("departmentHeader");
    departmentHeader.textContent = department; // Nombre del departamento

    departmentContainer.appendChild(departmentHeader); // Añadir el encabezado al contenedor del departamento

    // Iterar sobre cada bloque dentro del departamento
    for (const block in data.documents[department]) {
      const blockHeader = document.createElement("h3");
      blockHeader.classList.add("blockHeader");
      blockHeader.textContent = block; // Nombre del bloque

      departmentContainer.appendChild(blockHeader); // Añadir el encabezado del bloque al contenedor del departamento

      const ul = document.createElement("ul"); // Lista de documentos del bloque

      data.documents[department][block].forEach((doc) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${doc.filePath}" download>${doc.fileName}</a>`;
        ul.appendChild(li); // Añadir documento a la lista
      });

      departmentContainer.appendChild(ul); // Añadir la lista de documentos al bloque en el contenedor del departamento
    }

    documentsBySocietyContainer.appendChild(departmentContainer); // Añadir el contenedor del departamento al contenedor principal
  }
}
