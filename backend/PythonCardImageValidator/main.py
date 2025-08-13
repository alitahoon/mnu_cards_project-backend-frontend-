import io
from typing import Dict, Any
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from PIL import Image
import cv2
import numpy as np
import base64
from io import BytesIO
app = FastAPI(title="ID Photo Validator", version="1.0.0")

# ----------------- Constants -----------------
MIN_RES_W = 480
MIN_RES_H = 720
ASPECT_RATIO = 2/3
ASPECT_TOL = 0.06
BORDER_PCT = 0.10
WHITE_RATIO_MIN = 0.90
LAPLACIAN_MIN = 100.0
FACE_MIN_HEIGHT_RATIO = 0.55
FACE_MAX_HEIGHT_RATIO = 0.85
CENTER_TOL_W = 0.10
CENTER_TOL_H = 0.10

# ----------------- Helper Functions -----------------
def pil_to_bgr(pil_img: Image.Image) -> np.ndarray:
    return cv2.cvtColor(np.array(pil_img.convert("RGB")), cv2.COLOR_RGB2BGR)

def compute_laplacian_variance(gray: np.ndarray) -> float:
    return cv2.Laplacian(gray, cv2.CV_64F).var()

def aspect_ratio_ok(w: int, h: int) -> Dict[str, Any]:
    ar = w / h
    return {"value": float(ar), "pass": bool(abs(ar - ASPECT_RATIO)/ASPECT_RATIO <= ASPECT_TOL)}

def resolution_ok(w: int, h: int) -> Dict[str, Any]:
    return {"value": [int(w), int(h)], "pass": bool(w >= MIN_RES_W and h >= MIN_RES_H)}

def border_white_ratio(bgr: np.ndarray) -> float:
    h, w = bgr.shape[:2]
    bw, bh = int(w*BORDER_PCT), int(h*BORDER_PCT)
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[:bh, :] = 1
    mask[h-bh:, :] = 1
    mask[:, :bw] = 1
    mask[:, w-bw:] = 1
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    lower_white = np.array([0, 0, 200], dtype=np.uint8)
    upper_white = np.array([180, 30, 255], dtype=np.uint8)
    white_mask = cv2.inRange(hsv, lower_white, upper_white)
    border_pixels = (mask==1).sum()
    white_border_pixels = (white_mask[mask==1]>0).sum()
    return float(white_border_pixels / border_pixels) if border_pixels else 0.0

def background_white_ok(bgr: np.ndarray) -> Dict[str, Any]:
    wr = border_white_ratio(bgr)
    return {"value": wr, "pass": bool(wr >= WHITE_RATIO_MIN)}

def face_and_pose_checks_opencv(img: np.ndarray) -> Dict[str, Any]:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)
    if len(faces) == 0:
        return {"face_present": False, "pass": False, "reason": "No face detected"}
    x, y, w, h = faces[0]
    h_img, w_img = img.shape[:2]
    face_centered_ok = bool((abs((x+w/2)-w_img/2)/w_img <= CENTER_TOL_W) and (abs((y+h/2)-h_img/2)/h_img <= CENTER_TOL_H))
    face_height_ratio = h / h_img
    face_size_ok = bool(FACE_MIN_HEIGHT_RATIO <= face_height_ratio <= FACE_MAX_HEIGHT_RATIO)
    overall_ok = bool(face_centered_ok and face_size_ok)
    return {
        "face_present": True,
        "face_centered_ok": face_centered_ok,
        "face_size_ok": face_size_ok,
        "facing_camera_ok": overall_ok,
        "pass": overall_ok,
        "bbox_abs": [int(x), int(y), int(w), int(h)]
    }

def validate_core(bgr: np.ndarray) -> Dict[str, Any]:
    h, w = bgr.shape[:2]
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    ar = aspect_ratio_ok(w, h)
    res_ok = resolution_ok(w, h)
    bg = background_white_ok(bgr)
    lap = compute_laplacian_variance(gray)
    sharp_ok = {"value": float(lap), "pass": bool(lap >= LAPLACIAN_MIN)}
    pose = face_and_pose_checks_opencv(bgr)
    overall = bool(ar["pass"] and res_ok["pass"] and bg["pass"] and sharp_ok["pass"] and pose["pass"])
    return {
        "overall_pass": overall,
        "aspect_ratio": ar,
        "resolution": res_ok,
        "background_white": bg,
        "sharpness": sharp_ok,
        "face_pose": pose
    }

# ----------------- FastAPI Endpoints -----------------
@app.post("/validate")
async def validate(file: UploadFile = File(...)):
    try:
        raw = await file.read()
        pil = Image.open(io.BytesIO(raw))
        bgr = pil_to_bgr(pil)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")
    result = validate_core(bgr)
    return JSONResponse(content=result)


@app.post("/debug")
async def debug(file: UploadFile = File(...)):
    try:
        raw = await file.read()
        pil = Image.open(BytesIO(raw))
        bgr = pil_to_bgr(pil)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    result = validate_core(bgr)  # your existing validations

    # create annotated image (for example, draw bounding boxes)
    annotated = bgr.copy()
    pose = face_and_pose_checks_opencv(bgr)
    if pose.get("face_present"):
        x, y, w, h = pose["bbox_abs"]
        cv2.rectangle(annotated, (x, y), (x + w, y + h), (0, 255, 0), 2)

    # convert annotated image to base64
    pil_annotated = Image.fromarray(cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB))
    buffered = BytesIO()
    pil_annotated.save(buffered, format="JPEG")
    img_b64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

    result["annotated_image_base64"] = img_b64
    return JSONResponse(content=result)