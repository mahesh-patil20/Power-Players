import cv2

def motionDetection():
    cap = cv2.VideoCapture(0)

    ret, frame1 = cap.read()
    ret, frame2 = cap.read()

    while cap.isOpened():
        diff = cv2.absdiff(frame1, frame2)
        diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(diff_gray, (5, 5), 0)
        
        # Calculate the magnitude of the difference between frames
        magnitude = cv2.norm(blur, cv2.NORM_L1)
        
        _, thresh = cv2.threshold(blur, 20, 255, cv2.THRESH_BINARY)
        dilated = cv2.dilate(thresh, None, iterations=3)
        contours, _ = cv2.findContours(dilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        max_contour_area = 0
        max_contour = None

        for contour in contours:
            area = cv2.contourArea(contour)
            if area < 900 or magnitude < 200:  # Adjust the threshold for significant motion
                continue
            
            if area > max_contour_area:
                max_contour_area = area
                max_contour = contour

        if max_contour is not None:
            x, y, w, h = cv2.boundingRect(max_contour)
            cv2.rectangle(frame1, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(frame1, "STATUS: {}".format('MOTION DETECTED'), (10, 60), cv2.FONT_HERSHEY_SIMPLEX,
                        1, (217, 10, 10), 2)

        cv2.imshow("Video", frame1)
        frame1 = frame2
        ret, frame2 = cap.read()

        if cv2.waitKey(50) == 27:
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    motionDetection()
