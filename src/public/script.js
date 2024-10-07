let currentUser = null;
let currentDocument = null;
const signaturePad = new SignaturePad(document.getElementById("signaturePad"));

function resetUI() {
  document.getElementById("loginForm").reset();
  document.getElementById("managerArea").classList.add("hidden");
  document.getElementById("workerArea").classList.add("hidden");
  document.getElementById("pdfViewer").classList.add("hidden");
  document.getElementById("saveSignature").classList.add("hidden");
  signaturePad.clear();
  currentUser = null;
  currentDocument = null;
}

// Login del usuario
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
      document.getElementById("logoutBtn").classList.remove("hidden");

      if (currentUser.role === "manager") {
        document.getElementById("managerArea").classList.remove("hidden");
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
    const documentFile = document.getElementById("document").files[0];
    const formData = new FormData();
    formData.append("document", documentFile);
    formData.append("societyId", currentUser.societyId);

    const response = await fetch("http://localhost:3000/documents/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      alert("Documento subido correctamente.");
      loadSocietyDocuments();
    } else {
      alert("Error al subir el documento: " + data.message);
    }
  });

// Cargar lista de trabajadores para el manager
async function loadWorkerList() {
  const response = await fetch(
    `http://localhost:3000/workers/manager/worker-list/${currentUser.id}`
  );
  const data = await response.json();

  const workerList = document.getElementById("workerList");
  workerList.innerHTML = "";

  data.workers.forEach((worker) => {
    const workerItem = document.createElement("div");
    workerItem.innerHTML = `<strong>${worker.name}</strong>`;
    workerItem.style.cursor = "pointer";

    workerItem.addEventListener("click", () => loadWorkerDocuments(worker.id));

    workerList.appendChild(workerItem);
  });
}

// Cargar documentos firmados por el trabajador seleccionado (manager)
// Cargar documentos firmados por el trabajador seleccionado (manager)
async function loadWorkerDocuments(workerId) {
  const response = await fetch(
    `http://localhost:3000/workers/manager/worker-documents/${currentUser.id}/${workerId}`
  );
  const data = await response.json();

  const documentsByWorkerContainer =
    document.getElementById("documentsByWorker");
  documentsByWorkerContainer.innerHTML = "";

  data.documents.forEach((doc) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${doc.filePath}" download>${doc.fileName}</a>`;
    documentsByWorkerContainer.appendChild(li);
  });
}

// Cargar documentos subidos por el manager para el trabajador
async function loadDocumentsForWorker() {
  const response = await fetch(
    `http://localhost:3000/documents/documents/${currentUser.id}`
  );
  const data = await response.json();

  const documentList = document.getElementById("documentList");
  documentList.innerHTML = "";

  data.societyDocuments.forEach((doc) => {
    const li = document.createElement("li");
    li.innerHTML = `<span style="cursor:pointer">${doc.fileName}</span>`;
    li.addEventListener("click", () => {
      currentDocument = doc.fileName;
      previewDocument(doc.filePath);
    });
    documentList.appendChild(li);
  });
}

// Previsualizar el documento
function previewDocument(documentUrl) {
  const pdfViewer = document.getElementById("pdfViewer");
  pdfViewer.src = documentUrl;
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

    try {
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
        document.getElementById("pdfViewer").src = data.filePath;

        document.getElementById("saveSignature").classList.add("hidden");
        signaturePad.clear();
        loadDocumentsForWorker();
        loadSignedDocumentsForWorker();
      } else {
        alert("Error al firmar el documento.");
      }
    } catch (error) {
      alert("Error de red al firmar el documento.");
    }
  });

// Cargar documentos firmados por el trabajador
async function loadSignedDocumentsForWorker() {
  const response = await fetch(
    `http://localhost:3000/workers/worker/signed-documents/${currentUser.id}`
  );
  const data = await response.json();

  const signedDocumentList = document.getElementById("signedDocumentList");
  signedDocumentList.innerHTML = "";

  data.signedDocuments.forEach((doc) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${doc.filePath}" download>${doc.fileName}</a>`;
    signedDocumentList.appendChild(li);
  });
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

  data.documents.forEach((doc) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${doc.filePath}" download>${doc.fileName}</a>`;
    documentsBySocietyContainer.appendChild(li);
  });
}
