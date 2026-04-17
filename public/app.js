const form = document.getElementById("uploadForm");
const input = document.getElementById("imageInput");
const resultCard = document.getElementById("result");
const imageUrlInput = document.getElementById("imageUrl");
const preview = document.getElementById("preview");
const gallery = document.getElementById("gallery");
const copyBtn = document.getElementById("copyBtn");

async function loadGallery() {
  const res = await fetch("/api/images");
  const data = await res.json();

  gallery.innerHTML = "";

  for (const item of data.images) {
    const card = document.createElement("div");
    card.className = "gallery-item";

    const img = document.createElement("img");
    img.src = item.url;
    img.alt = item.name;

    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = item.url;

    card.appendChild(img);
    card.appendChild(link);
    gallery.appendChild(card);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const file = input.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Upload failed");
    return;
  }

  resultCard.classList.remove("hidden");
  imageUrlInput.value = data.url;
  preview.src = data.url;
  preview.alt = data.filename;

  await loadGallery();
  form.reset();
});

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(imageUrlInput.value);
  copyBtn.textContent = "Copied";
  setTimeout(() => {
    copyBtn.textContent = "Copy URL";
  }, 1200);
});

loadGallery();
