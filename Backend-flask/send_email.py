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

# Attach the downloaded image
image = MIMEImage(image_data)
image.add_header('Content-ID', '<image_cid>')

# Open the second image from local path
image2_path = 'C:/Users/Sanjay/Desktop/ace hack project/Power-Players/Backend-flask/images/image-2.png'
with open(image2_path, 'rb') as image2_file:
    image2 = MIMEImage(image2_file.read(), name='image2.png')
    image2.add_header('Content-ID', '<image2_cid>')

# Create a multipart message
msg = MIMEMultipart()
msg['From'] = email_sender
msg['To'] = email_receiver
msg['Subject'] = subject

# HTML body with embedded images using Content-ID
html_body = f"""
<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="x-apple-disable-message-reformatting">
<title>{subject}</title>
<style type="text/css">
    /* Your CSS styles here */
</style>
</head>
<body style="margin: 0; padding: 0; background-color: #e7e7e7; font-family: 'Montserrat', sans-serif; color: #000000;">
    <div class="u-row-container" style="padding: 0px; background-color: #5078bb;">
        <div class="u-row" style="margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
            <div style="border-collapse: collapse; display: table; width: 100%; height: 100%; background-color: transparent;">
                <div class="u-col u-col-100" style="max-width: 320px; min-width: 600px; display: table-cell; vertical-align: top;">
                    <div style="height: 100%; width: 100% !important; border-radius: 0px;">
                        <img src="cid:image_cid" alt="PCI Compliance Banner" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; display: inline-block !important; border: none; height: auto; float: none; width: 69%; max-width: 400.2px;">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="u-row-container" style="padding: 0px; background-color: #ffffff;">
        <div class="u-row" style="margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
            <div style="border-collapse: collapse; display: table; width: 100%; height: 100%; background-color: transparent;">
                <div class="u-col u-col-100" style="max-width: 320px; min-width: 600px; display: table-cell; vertical-align: top;">
                    <div style="height: 100%; width: 100% !important;">
                        <img align="center" border="0" src="cid:image2_cid" alt="image" title="image" style="outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; clear: both; display: inline-block !important; border: none; height: auto; float: none; width: 73%; max-width: 438px;">
                        <h1 style="margin: 0px; color: #000000; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 30px; font-weight: 400;"><strong>Alert Message</strong></h1>
                        <div style="font-size: 14px; color: #222222; line-height: 140%; text-align: center;">
                            <p>Message</p>
                        </div>
                        <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 22px; font-weight: 400;">Do you want to contact emergency services?</h1>
                        <div align="center">
                            <a href="#" target="_blank" style="box-sizing: border-box; display: inline-block; text-decoration: none; -webkit-text-size-adjust: none; text-align: center; color: #FFFFFF; background-color: #3AAEE0; border-radius: 4px; width: auto; max-width: 100%; overflow-wrap: break-word; word-wrap: break-word; mso-border-alt: none; font-size: 14px;">
                                <span style="display: block; padding: 10px 20px; line-height: 120%;">Yes</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
"""

# Attach HTML body to the message
msg.attach(MIMEText(html_body, 'html'))

# Attach images to the message
msg.attach(image)
msg.attach(image2)

context = ssl.create_default_context()

# Send email
with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
    smtp.login(email_sender, email_password)
    smtp.sendmail(email_sender, email_receiver, msg.as_string())
