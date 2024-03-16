import cv2
import imutils

# Function to continuously capture video frames and detect motion
def detect_motion(camera_index):
    camera = cv2.VideoCapture(camera_index)
    camera.set(3, 640)  # Set frame width
    camera.set(4, 480)  # Set frame height
    
    # Initialize variables
    alarm = False
    alarm_counter = 0
    first_frame = None

    while True:
        _, frame = camera.read()
        frame = imutils.resize(frame, width=500)
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blurred_frame = cv2.GaussianBlur(gray_frame, (21, 21), 0)

        if first_frame is None:
            first_frame = blurred_frame
            continue

        frame_delta = cv2.absdiff(first_frame, blurred_frame)
        thresh = cv2.threshold(frame_delta, 30, 255, cv2.THRESH_BINARY)[1]
        thresh = cv2.dilate(thresh, None, iterations=2)
        contours = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        contours = imutils.grab_contours(contours)

        # Check for motion
        motion_detected = False
        for contour in contours:
            if cv2.contourArea(contour) > 300:
                motion_detected = True
                break

        if motion_detected:
            alarm_counter += 1
            if not alarm:
                print("Motion detected!")
                alarm = True
        else:
            alarm_counter -= 1
            alarm_counter = max(alarm_counter, 0)

        if alarm_counter > 20:
            alarm = True
        else:
            alarm = False

        # Display video feed
        if alarm:
            cv2.putText(frame, "ALERT: MOTION DETECTED", (10, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
        cv2.imshow("Video Feed", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break
        elif key == ord("t"):
            alarm = not alarm

    camera.release()
    cv2.destroyAllWindows()

# Start motion detection on primary camera (index 0)
detect_motion(0)

