// ==============================
// DOCUMENT DISPLAY + SEARCH
// ==============================

const docList = document.getElementById("docList");
const searchInput = document.getElementById("searchInput");

// Load and show documents
function loadDocuments(filter = "") {
  const docs = getDocuments();

  docList.innerHTML = "";

  const filteredDocs = docs.filter(doc =>
    doc.patient.toLowerCase().includes(filter.toLowerCase()) ||
    doc.type.toLowerCase().includes(filter.toLowerCase())
  );

  if (filteredDocs.length === 0) {
    docList.innerHTML =
      "<p class='text-center'>No matching documents found.</p>";
    return;
  }

  filteredDocs.forEach(doc => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-3";

    card.innerHTML = `
      <div class="card p-3">
        <h5>${doc.patient}</h5>
        <p><strong>Type:</strong> ${doc.type}</p>
        <p><strong>Date:</strong> ${doc.date}</p>

        ${
          doc.fileData.includes("application/pdf")
            ? `<iframe src="${doc.fileData}" width="100%" height="200"></iframe>`
            : `<img src="${doc.fileData}" class="img-fluid mb-2" />`
        }

        <button
          class="btn btn-danger w-100 mt-2"
          onclick="deleteDocument(${doc.id})"
        >
          Delete
        </button>
      </div>
    `;

    docList.appendChild(card);
  });
}

// Delete document
function deleteDocument(id) {
  let docs = getDocuments();
  docs = docs.filter(d => d.id !== id);
  saveDocuments(docs);
  loadDocuments(searchInput.value);
}

// Search listener
if (searchInput) {
  searchInput.addEventListener("input", () => {
    loadDocuments(searchInput.value);
  });
}

// Initial load
loadDocuments();


// ==============================
// MEDICINE API INTEGRATION
// ==============================

async function searchMedicine() {
  const name = document.getElementById("medicineInput").value.trim();
  const resultDiv = document.getElementById("medicineResult");

  if (!name) {
    resultDiv.innerHTML =
      "<p class='text-danger'>Enter a medicine name.</p>";
    return;
  }

  resultDiv.innerHTML = "<p>Loading medicine data...</p>";

  try {
   const response = await fetch(
  `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(name)}&limit=1`
);


    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      resultDiv.innerHTML = "<p>No data found.</p>";
      return;
    }

    const drug = data.results[0];

    resultDiv.innerHTML = `
      <div class="card p-3">
        <h5>💊 Medicine Info</h5>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Purpose:</strong> ${drug.purpose?.[0] || "N/A"}</p>
        <p><strong>Warnings:</strong> ${drug.warnings?.[0] || "N/A"}</p>
        <p><strong>Usage:</strong> ${
          drug.indications_and_usage?.[0] || "N/A"
        }</p>
      </div>
    `;
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML =
      "<p class='text-danger'>Error fetching medicine info.</p>";
  }
}
