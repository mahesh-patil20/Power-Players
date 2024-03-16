import datetime
from flask import Flask, jsonify, request
import threading
import time
import face_recognition
import numpy as np
import os 
import cv2
import requests
from pymongo import MongoClient
from dotenv import load_dotenv
import base64
from black_screen import is_camera_covered
app = Flask(__name__)

env_path = '../server/config.env'  # Update with your actual path

# Load environment variables from the specified .env file
load_dotenv(dotenv_path=env_path)

# MongoDB connection string
MONGODB_URL = os.getenv('MONGODB_URL')

# Create a MongoDB client instance
client = MongoClient(MONGODB_URL)
db = client['test']
collection = db['intruders']
# print(collection)
# Placeholder for known encodings and names
known_encodings = []
known_names = []
face_recognition_active = False
video_capture = None
stop_thread = False

def load_known_faces(image_folder):
    global known_encodings, known_names
    # Load images and encode known faces
    face_images = [os.path.join(image_folder, img) for img in os.listdir(image_folder) if img.endswith(".jpg")]
    for image_path in face_images:
        # Extract the name from the image file name
        name = os.path.splitext(os.path.basename(image_path))[0]
        known_names.append(name)

        # Load and encode the face
        image = face_recognition.load_image_file(image_path)
        encoding = face_recognition.face_encodings(image)[0]  # Assuming only one face per image
        known_encodings.append(encoding)

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
        
        # Check if the camera is covered before proceeding with face recognition
        if is_camera_covered():
            print("Camera is covered. Face recognition cannot proceed.")
            continue  # Skip face recognition if the camera is covered
        
        ret, frame = video_capture.read()
        face_locations = face_recognition.face_locations(frame)
         
        if face_locations:
            top, right, bottom, left = max(face_locations, key=lambda f: (f[2] - f[0]) * (f[1] - f[3]))
            face_encodings = face_recognition.face_encodings(frame[top:bottom, left:right])

            if face_encodings:
                face_distances = face_recognition.face_distance(known_encodings, face_encodings[0])
                best_match_index = np.argmin(face_distances)

                if face_distances[best_match_index] < 0.5:
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
                        encoding_data = {
                            'intruder_image_base64': intruder_image_base64,
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
        return

if __name__ == '__main__':
    load_known_faces(r"trial_images")  # Load known faces from the image folder
    app.run(debug=True)
