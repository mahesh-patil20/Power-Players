# FINAL WORKING AUTOMATED EMAIL SYSTEM FOR INTRUDER DETECTION

import ssl
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import requests
import base64
from PIL import Image
from io import BytesIO


# Email credentials and recipient
email_sender = 'maxfurry3009@gmail.com'
email_password = ''  # Insert your email password here
email_receiver = 'mahesh.patil@spit.ac.in'

subject = 'Check Your Child History'

# URL where the Base64-encoded image is located
base64_image_url = 'http://localhost:5000/getLatestIntruderImage'  # Replace with the actual URL

# Function to fetch the Base64-encoded image using requests
def get_base64_image_data(base64_image_url):
    response = requests.get(base64_image_url)
    return response.json()[0]['intruder_image_base64']  # Extract the Base64-encoded image

# Get the image data
image_data = get_base64_image_data(base64_image_url)

# Create the email message
msg = MIMEMultipart()
msg['From'] = email_sender
msg['To'] = email_receiver
msg['Subject'] = subject

# Function to attach image with MIME subtype based on Pillow
def attach_image_with_subtype(msg, image_data):
    image = Image.open(BytesIO(base64.b64decode(image_data)))
    image_type = image.format.lower()
    
    if image_type in ['jpeg', 'jpg']:
        image_subtype = 'jpeg'
    elif image_type == 'png':
        image_subtype = 'png'
    else:
        print("Warning: Unsupported image format")
        return

    image_data = base64.b64decode(image_data)
    image = MIMEImage(image_data, subtype=image_subtype)
    image.add_header('Content-ID', '<image_cid>')
    msg.attach(image)

# Attach the fetched image to the email
attach_image_with_subtype(msg, image_data)

# Update HTML body to use attached image
html_body = f"""
<!DOCTYPE html>
<html>
<body>
  <h1>ALERT !! Intruder Detected </h1>
  <h3>Location: ATHARVA COLLEGE OF ENGINEERING, MALAD</h3>
  <p>Here is the image of the suspect</p><br>
  <img src="cid:image_cid" alt="Fetched Image">
</html>
"""

msg.attach(MIMEText(html_body, 'html'))

# Send the email
context = ssl.create_default_context()

with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
    smtp.login(email_sender, email_password)
    smtp.sendmail(email_sender, email_receiver, msg.as_string())

print("Email sent successfully!")