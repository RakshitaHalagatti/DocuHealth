// Get all saved documents
function getDocuments() {
  return JSON.parse(localStorage.getItem("documents")) || [];
}

// Save documents array back to LocalStorage
function saveDocuments(docs) {
  localStorage.setItem("documents", JSON.stringify(docs));
}
