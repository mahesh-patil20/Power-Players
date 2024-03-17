import cv2
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

# Load the trained model
def load_model(model_path):
    model = load_model(model_path)
    return model

# Function for preprocessing input image
def preprocess_image(image, target_size=(224, 224)):
    image = cv2.resize(image, target_size)  # Resize image to target size
    image = image.astype('float') / 255.0    # Normalize pixel values to [0, 1]
    image = img_to_array(image)             # Convert image to array
    image = np.expand_dims(image, axis=0)   # Add batch dimension
    return image

def main():
    # Load the trained model
    model_path = 'path_to_your_model.h5'  # Specify the path to your trained model
    model = load_model(model_path)

    # Capture video from webcam or camera
    video_capture = cv2.VideoCapture(0)  # Use 0 for webcam, or specify video file path

    while True:
        # Capture frame-by-frame
        ret, frame = video_capture.read()

        # Perform prediction on the captured frame
        preprocessed_frame = preprocess_image(frame)
        door_state = model.predict(preprocessed_frame)

        # Display the result on the frame
        cv2.putText(frame, "Door State: {}".format(door_state), (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
        cv2.imshow('Door State Detection', frame)

        # Break the loop when 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the video capture object and close all windows
    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()