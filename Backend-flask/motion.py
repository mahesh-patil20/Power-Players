import cv2
import numpy as np

def motionDetection():
    cap = cv2.VideoCapture(0)
    alarm_triggered = False

    while cap.isOpened():
        ret, frame1 = cap.read()
        ret, frame2 = cap.read()

        diff = cv2.absdiff(frame1, frame2)
        diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(diff_gray, (5, 5), 0)
        
        # Calculate the magnitude of the difference between frames
        magnitude = cv2.norm(blur, cv2.NORM_L1)
        
        _, thresh = cv2.threshold(blur, 20, 255, cv2.THRESH_BINARY)
        dilated = cv2.dilate(thresh, None, iterations=3)
        contours, _ = cv2.findContours(dilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        # Check for significant motion
        if magnitude > 200:
            if not alarm_triggered:
                # Play alarm
                cv2.putText(frame1, "ALARM: {}".format('MOTION DETECTED'), (10, 60), cv2.FONT_HERSHEY_SIMPLEX,
                            1, (0, 0, 255), 2)
                alarm_triggered = True
        else:
            # Change color of detected motion area to white
            frame1[dilated > 0] = [255, 255, 255]

            # Reset alarm trigger
            alarm_triggered = False

        cv2.imshow("Video", frame1)

        if cv2.waitKey(50) == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    motionDetection()
