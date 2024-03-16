import datetime
from flask import Flask, jsonify, request
import threading
import time
import face_recognition
import numpy as np
import os
import cv2
from pymongo import MongoClient
from dotenv import load_dotenv
import base64
from flask_cors import CORS
from keras.models import model_from_json

app = Flask(__name__)
CORS(app)

env_path = '../server/config.env'  # Update with your actual path

# Load environment variables from the specified .env file
load_dotenv(dotenv_path=env_path)

# MongoDB connection string
MONGODB_URL = os.getenv('MONGODB_URL')

# Create a MongoDB client instance
client = MongoClient(MONGODB_URL)
db = client['test']
collection = db['intruders']
collection2 = db['alloweduserlists']

# Placeholder for known encodings and names
known_encodings = []
known_names = []
face_recognition_active = False
video_capture = None
stop_thread = False

# Load emotion detection model
json_file = open('models/emotion_model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
emotion_model = model_from_json(loaded_model_json)
emotion_model.load_weights("models/emotion_model.h5")
print("Loaded emotion detection model from disk")

# Define emotion dictionary
emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful", 3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}

def fetch_and_train_allowed_faces():
    global known_encodings, known_names
    cursor = collection2.find({}, {'name': 1, 'image': 1, '_id': 0})
    for user in cursor:
        encoded_image = user['image'] if user and 'image' in user else None
        if encoded_image:
            # Decode the base64 image and convert it to a NumPy array
            image_bytes = base64.b64decode(encoded_image.split(',')[1])
            image_np = np.frombuffer(image_bytes, dtype=np.uint8)
            image = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
            # Convert the image to RGB format (required for face recognition)
            rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            # Detect face locations and encodings
            face_locations = face_recognition.face_locations(rgb_image)
            face_encodings = face_recognition.face_encodings(rgb_image, face_locations)
            if face_encodings:
                known_encodings.extend(face_encodings)
                known_names.extend([user['name']] * len(face_encodings))
    print("Faces fetched and trained successfully.")

def start_face_recognition():
    global face_recognition_active, video_capture, stop_thread, intruder_detected
    intruder_detected = False
    video_capture = cv2.VideoCapture(0)
    while True:
        if stop_thread:
            video_capture.release()
            return
        if not face_recognition_active:
            time.sleep(0.1)
            continue
        
        ret, frame = video_capture.read()
        face_locations = face_recognition.face_locations(frame)
         
        if face_locations:
            top, right, bottom, left = max(face_locations, key=lambda f: (f[2] - f[0]) * (f[1] - f[3]))
            face_encodings = face_recognition.face_encodings(frame[top:bottom, left:right])

            if face_encodings:
                face_distances = face_recognition.face_distance(known_encodings, face_encodings[0])
                best_match_index = np.argmin(face_distances)

                if face_distances[best_match_index] < 0.55:
                    name = known_names[best_match_index]
                    print(f"Known face detected: {name}")
                    intruder_detected = False  # Reset the intruder flag
                else:
                    if not intruder_detected:  # Capture intruder encoding only once
                        print("Unknown face detected. Encoding intruder image...")
                        # Encode the intruder image using base64
                        _, encoded_image = cv2.imencode('.jpg', frame[top:bottom, left:right])
                        intruder_image_base64 = base64.b64encode(encoded_image).decode('utf-8')
                        current_time = str(datetime.datetime.now())
                        # Detect emotion of the intruder
                        emotion_prediction = detect_emotion(frame[top:bottom, left:right])
                        encoding_data = {
                            'intruder_image_base64': intruder_image_base64,
                            'emotion': emotion_prediction,
                            'timestamp': current_time
                        }
                        collection.insert_one(encoding_data)
                        intruder_detected = True  # Set intruder flag to prevent further captures
        cv2.imshow('Video', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

def stop_face_recognition():
    global face_recognition_active, stop_thread
    face_recognition_active = False
    stop_thread = True

def detect_emotion(image):
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    resized_image = cv2.resize(gray_image, (48, 48))
    normalized_image = resized_image / 255.0  # Normalize pixel values
    input_image = np.expand_dims(np.expand_dims(normalized_image, -1), 0)  # Add batch dimension
    emotion_prediction = emotion_model.predict(input_image)
    emotion_index = np.argmax(emotion_prediction)
    return emotion_dict[emotion_index]

@app.route('/')
def home():
    return 'Welcome to the Face Recognition API!'

@app.route('/start', methods=['GET'])
def start():
    global face_recognition_active, stop_thread
    if not face_recognition_active:
        face_recognition_active = True
        stop_thread = False
        threading.Thread(target=start_face_recognition).start()
        fetch_and_train_allowed_faces()  # Fetch and train allowed faces before starting
        return jsonify({'message': 'Face recognition started.'})
    else:
        return jsonify({'message': 'Face recognition already active.'})

@app.route('/stop', methods=['POST', 'GET'])  # Allow both POST and GET methods
def stop():
    global face_recognition_active
    if face_recognition_active:
        stop_face_recognition()
        return jsonify({'message': 'Face recognition stopped.'})
    else:
        return jsonify({'message': 'Face recognition not active.'})
    
  
@app.route('/fetch_intruders', methods=['GET'])
def fetch_intruders():
    cursor = collection.find({}, {'_id': 0})
    intruders = list(cursor)
    return jsonify(intruders)

if __name__ == '_main_':
    app.run(debug=True, port=7000)