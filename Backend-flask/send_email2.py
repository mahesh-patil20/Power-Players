import ssl
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import requests
import base64
import imghdr  # Import imghdr for image type detection

# Email credentials and recipient
email_sender = 'maxfurry3009@gmail.com'
email_password = 'ixwx wnax livu utbh'
email_receiver = 'mahesh.patil@spit.ac.in'

subject = 'Check Your Child History'

# URL where the Base64-encoded image is located
base64_image_url = 'http://localhost:5000/getLatestIntruderImage'  # Replace with the actual URL

# # Function to fetch the Base64-encoded image using requests
# def get_base64_image(base64_image_url):
#     response = requests.get(base64_image_url)
#     return response.content  # Assuming the response contains the Base64-encoded image

# # Get the image data
# image_data = get_base64_image(base64_image_url)

def get_base64_image_data(response):
    print("RESPONSE:", response.json()[0]['intruder_image_base64'])
    return response.json()[0]['intruder_image_base64']  # Extract the Base64-encoded image

# Get the image data
response = requests.get(base64_image_url)  # Call the API to get the image
image_data = get_base64_image_data(response)

# Create the email message
msg = MIMEMultipart()
msg['From'] = email_sender
msg['To'] = email_receiver
msg['Subject'] = subject

# Function to attach image with MIME subtype based on imghdr
def attach_image_with_subtype(msg, image_data):
    image_type = imghdr.what(None, image_data)

    if image_type:
        # Use the detected image type
        image = MIMEImage(image_data, maintype='image', subtype=image_type.split('/')[1])
        image.add_header('Content-ID', '<image_cid>')
        msg.attach(image)
    else:
        print("Warning: Could not determine image type")

# Attach the fetched image to the email (using attach_image_with_subtype function)
attach_image_with_subtype(msg, image_data)

# Update HTML body to use attached image
html_body = f"""
<!DOCTYPE html>
<html>
<body>
  <h1>Check Your Child History</h1>
  <p>Here is the image:</p>
  <img src="cid:image_cid" alt="Fetched Image">
</body>
</html>
"""

msg.attach(MIMEText(html_body, 'html'))

# Send the email
context = ssl.create_default_context()

with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
    smtp.login(email_sender, email_password)
    smtp.sendmail(email_sender, email_receiver, msg.as_string())

print("Email sent successfully!")
