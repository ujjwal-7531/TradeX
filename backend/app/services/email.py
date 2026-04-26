import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def send_otp_email(to_email: str, otp: str):
    print(f"Began sending OTP email to {to_email}")
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = f"TradeX <{SMTP_EMAIL}>"
        msg['To'] = to_email
        msg['Subject'] = "Your TradeX Verification Code"

        text = f"Your verification code is: {otp}\nIt expires in 5 minutes."
        
        html = f"""
        <div style="font-family: sans-serif; padding: 20px;">
            <h3>TradeX Verification</h3>
            <p>Your sign-up verification code is:</p>
            <h2 style="color: #2563eb;">{otp}</h2>
            <p style="color: #666; font-size: 13px;">This code will expire in 5 minutes.</p>
        </div>
        """
        
        msg.attach(MIMEText(text, 'plain'))
        msg.attach(MIMEText(html, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

def send_reset_password_email(to_email: str, otp: str):
    print(f"Began sending reset email to {to_email}")
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = f"TradeX <{SMTP_EMAIL}>"
        msg['To'] = to_email
        msg['Subject'] = "TradeX Password Reset"

        text = f"Your password reset code is: {otp}\nIt expires in 5 minutes."
        
        html = f"""
        <div style="font-family: sans-serif; padding: 20px;">
            <h3>TradeX Password Reset</h3>
            <p>Your password recovery code is:</p>
            <h2 style="color: #ef4444;">{otp}</h2>
            <p style="color: #666; font-size: 13px;">This code expires in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
        """
        
        msg.attach(MIMEText(text, 'plain'))
        msg.attach(MIMEText(html, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

def send_welcome_email(to_email: str):
    print(f"Began sending welcome email to {to_email}")
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = f"TradeX <{SMTP_EMAIL}>"
        msg['To'] = to_email
        msg['Subject'] = "Welcome to TradeX!"

        text = "Welcome to TradeX! Your paper trading account is ready with ₹1,000,000."
        
        html = """
        <div style="font-family: sans-serif; padding: 20px;">
            <h3>Welcome aboard! 🚀</h3>
            <p>Thanks for creating an account on TradeX.</p>
            <p>We've deposited a virtual paper trading balance of <strong>₹1,000,000</strong> into your account so you can start practicing risk-free right now.</p>
            <br>
            <p>Happy trading!</p>
        </div>
        """
        
        msg.attach(MIMEText(text, 'plain'))
        msg.attach(MIMEText(html, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
