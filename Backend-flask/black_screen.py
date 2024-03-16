import cv2

def is_camera_covered():
    # Open the camera
    cap = cv2.VideoCapture(0)

    while cap.isOpened():
        # Capture a frame from the camera
        ret, frame = cap.read()

        # Check if the frame was captured successfully
        if not ret:
            print("Error: Failed to capture frame")
            break

        # Convert the frame to grayscale for easier analysis
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Threshold the grayscale image
        _, threshold = cv2.threshold(gray, 100, 255, cv2.THRESH_BINARY)

        # Count the number of white pixels in the thresholded image
        num_white_pixels = cv2.countNonZero(threshold)

        # Set a threshold for the number of white pixels
        # You may need to adjust this threshold depending on your camera and lighting conditions
        threshold_value = 10000

        # Check if the number of white pixels exceeds the threshold
        if num_white_pixels > threshold_value:
            cv2.putText(frame, "Camera is not covered", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
        else:
            cv2.putText(frame, "Camera is covered", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        # Display the frame
        cv2.imshow('Camera Feed', frame)

        # Check for the 'q' key to quit the loop
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the camera and close all OpenCV windows
    cap.release()
    cv2.destroyAllWindows()

# Call the function to check if the camera is covered
is_camera_covered()
