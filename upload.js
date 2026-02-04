const form = document.getElementById("uploadForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const patient = document.getElementById("patient").value;
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;
  const fileInput = document.getElementById("file");

  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file!");
    return;
  }

  const reader = new FileReader();

  reader.onload = function () {
    const docs = getDocuments();

    const newDoc = {
      id: Date.now(),
      patient,
      type,
      date,
      fileData: reader.result,
      fileName: file.name
    };

    docs.push(newDoc);
    saveDocuments(docs);

    alert("✅ Document saved successfully!");

    form.reset();
  };

  reader.readAsDataURL(file);
});
