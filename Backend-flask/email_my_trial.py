import ssl
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import requests

email_sender = 'maxfurry3009@gmail.com'
email_password = 'ixwx wnax livu utbh'
email_receiver = 'akash.panicker@spit.ac.in'

subject = 'Check Your Child History'

# Download the image from the URL
image_url = 'https://itsupportguys.com/wp-content/uploads/2020/04/PCI-Compliance-banner.png.webp'
image_response = requests.get(image_url)
image_data = image_response.content

msg = MIMEMultipart()
msg['From'] = email_sender
msg['To'] = email_receiver
msg['Subject'] = subject

# Attach the downloaded image to the email
image = MIMEImage(image_data)
image.add_header('Content-ID', '<image_cid>')
msg.attach(image)

# Update HTML body to use attached image
html_body = f"""
<!DOCTYPE html>
<html>
<body>
  <h1>Check Your Child History</h1>
  <p>Here is the image:</p>
  <img src="cid:image_cid" alt="PCI Compliance Banner">
</body>
</html>
"""

msg.attach(MIMEText(html_body, 'html'))

context = ssl.create_default_context()

with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
    smtp.login(email_sender, email_password)
    smtp.sendmail(email_sender, email_receiver, msg.as_string())
