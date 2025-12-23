from fastapi import FastAPI, UploadFile
from transformers import pipeline
from PIL import Image
import io
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load the model using pipeline
clf = pipeline(
    "image-classification",
    model="prithivMLmods/Alphabet-Sign-Language-Detection"
)

# Class labels A–Z in order
labels = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","O","P","Q","R","S","T",
    "U","V","W","X","Y","Z"
]

@app.post("/predict")
async def predict(file: UploadFile):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    # Run model prediction
    preds = clf(image)
    predicted_label = preds[0]["label"]  # e.g. "A"

    return {"prediction": predicted_label}