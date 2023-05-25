import qrcode
import io
import cv2
from time import time

def make_qr_buffer(data):
  # Create QR code with given data
  qr_code = qrcode.make(data)
  
  # Turn it into bytes
  buff = io.BytesIO()
  qr_code.save(buff)
  
  return buff

def scan():
  # define a video capture object
  vid = cv2.VideoCapture(0)
  detector = cv2.QRCodeDetector()
  
  decoded_data = ""

  start_time = time()
  while (time() - start_time < 10):
      # Capture the video frame by frame
      ret, frame = vid.read()
      data, bbox, straight_qrcode = detector.detectAndDecode(frame)

      if len(data) > 0:
          print("Received data: ", data)
          decoded_data = data
          break
        
  # After the loop release the cap object
  vid.release()

  # Destroy all the windows
  cv2.destroyAllWindows()
  
  return decoded_data