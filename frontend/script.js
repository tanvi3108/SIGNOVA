/* Elements */
const imageInput = document.getElementById('imageInput');
const uploadBtn = document.getElementById('uploadBtn');
const removeBtn = document.getElementById('removeBtn');
const reuploadBtn = document.getElementById('reuploadBtn');
const previewArea = document.getElementById('previewArea');
const imagePreview = document.getElementById('imagePreview');
const convertBtn = document.getElementById('convertBtn');
const resultBox = document.getElementById('resultBox');
const resultText = document.getElementById('resultText');
const clearResultBtn = document.getElementById('clearResultBtn');
const uploaderTitle = document.getElementById('uploaderTitle');
const noteText = document.getElementById('noteText');

let currentFile = null;

/* Helpers */
function resetUploader(){
  imageInput.value = "";
  currentFile = null;
  previewArea.style.display = 'none';
  removeBtn.style.display = 'none';
  reuploadBtn.style.display = 'none';
  convertBtn.disabled = false;
  uploaderTitle.textContent = 'Upload Image';
  resultBox.style.display = 'none';
}

function showPreview(file){
  const url = URL.createObjectURL(file);
  imagePreview.src = url;
  previewArea.style.display = 'block';
  removeBtn.style.display = 'inline-flex';
  reuploadBtn.style.display = 'inline-flex';
  convertBtn.disabled = false;
  uploaderTitle.textContent = file.name;
}

/* Read file selection */
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return resetUploader();
  currentFile = file;
  showPreview(file);
});

/* Remove file */
removeBtn.addEventListener('click', () => {
  resetUploader();
});

/* Reupload (trigger input) */
reuploadBtn.addEventListener('click', () => {
  imageInput.click();
});

/* Convert button behavior (demo) */
convertBtn.addEventListener('click', async () => {
    if (!currentFile) {
        alert('Please upload an image first.');
        return;
    }

    convertBtn.textContent = 'Converting...';
    convertBtn.disabled = true;

    let formData = new FormData();
    formData.append("file", currentFile);

    try {
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        resultText.textContent = data.prediction;   // <-- Show prediction
        resultBox.style.display = 'block';
        clearResultBtn.style.display = 'inline-flex';

    } catch (err) {
        console.error(err);
        alert("Error connecting to backend!");
    }

    convertBtn.textContent = 'Convert into Text';
    convertBtn.disabled = false;
});

/* Clear result */
clearResultBtn.addEventListener('click', () => {
  resultBox.style.display = 'none';
  clearResultBtn.style.display = 'none';
});

/* Extra: support click on uploader area to open file dialog */
document.getElementById('uploader').addEventListener('click', (e) => {
  // ignore clicks on the preview image or buttons
  if(e.target.tagName === 'IMG' || e.target.closest('.btn') || e.target.tagName === 'BUTTON') return;
  imageInput.click();
});

/* initialize */
resetUploader();