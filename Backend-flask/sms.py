from twilio.rest import Client

# Your Twilio Account SID and Auth Token
account_sid = 'AC108ea743fcf1a93154a057452af67e27'
auth_token = '69ee464f0fdc75098208155e56059afd'

# Initialize Twilio Client
client = Client(account_sid, auth_token)

def send_sms(to, body):
    try:
        message = client.messages.create(
            body=body,
            from_='+15513138117',
            to=to
        )
        print("SMS sent successfully with SID:", message.sid)
    except Exception as e:
        print("Failed to send SMS:", str(e))


send_sms('+919167340521', 'Intrusion detected at your home!')