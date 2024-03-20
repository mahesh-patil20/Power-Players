from twilio.rest import Client

# Your Twilio Account SID and Auth Token

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