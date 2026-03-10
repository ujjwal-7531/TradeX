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
        print("SMTP config disabled or missing. Skipping email sending.")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = f"TradeX <{SMTP_EMAIL}>"
        msg['To'] = to_email
        msg['Subject'] = "Verify your TradeX Account"

        verification_link = f"http://localhost:5173/verify-otp?email={to_email}&otp={otp}"

        text_body = f"""
        Hello!
        
        Welcome to TradeX. To verify your account, please enter the following OTP: {otp}
        
        Or click this link to verify automatically:
        {verification_link}
        
        This OTP is valid for 5 minutes.
        
        Thanks,
        The TradeX Team
        """
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', sans-serif; background-color: #f3f4f6;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
                            <tr>
                                <td align="center" style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px 20px;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">TradeX</h1>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 40px 40px 20px 40px;">
                                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">Verify Your Email</h2>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        Thank you for signing up! Please enter the following 6-digit OTP to verify your account:
                                    </p>
                                    <div style="text-align: center; margin: 30px 0;">
                                        <span style="font-size: 32px; font-weight: 700; color: #2563eb; letter-spacing: 4px; background: #eff6ff; padding: 10px 20px; border-radius: 8px;">{otp}</span>
                                    </div>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0; text-align: center;">
                                        Or verify automatically by clicking the button below:
                                    </p>
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center">
                                                <a href="{verification_link}" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 600; font-size: 16px; text-decoration: none; padding: 14px 32px; border-radius: 8px; transition: background-color 0.2s;">
                                                    Verify Email Now
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td align="center" style="background-color: #f9fafb; padding: 30px 20px; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                                        This code will expire in 5 minutes.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        
        text = msg.as_string()
        server.sendmail(SMTP_EMAIL, to_email, text)
        server.quit()
        
        print(f"Sent OTP email successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")

def send_welcome_email(to_email: str):
    print(f"Began sending welcome email to {to_email}")
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("SMTP config disabled or missing. Skipping email sending.")
        return

    try:
        # Construct the email message
        msg = MIMEMultipart()
        msg['From'] = f"TradeX <{SMTP_EMAIL}>"
        msg['To'] = to_email
        msg['Subject'] = "Welcome to TradeX!"

        text_body = f"""
        Hello!
        
        Welcome to TradeX. We are absolutely thrilled to have you on board! 
        Your ₹1,000,000 paper trading balance is ready to go.
        
        Happy trading,
        The TradeX Team
        """
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
                            <!-- Header -->
                            <tr>
                                <td align="center" style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 40px 20px;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">TradeX</h1>
                                </td>
                            </tr>
                            
                            <!-- Body -->
                            <tr>
                                <td style="padding: 40px 40px 20px 40px;">
                                    <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">Welcome aboard! 🚀</h2>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                        We are absolutely thrilled to have you join the TradeX community. Your journey into the exciting world of trading starts right now.
                                    </p>
                                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                        To get you started risk-free, we've deposited a virtual paper trading balance of <strong>₹1,000,000</strong> directly into your account.
                                    </p>
                                    
                                    <!-- CTA Button -->
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td align="center">
                                                <a href="http://localhost:5173/login" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-weight: 600; font-size: 16px; text-decoration: none; padding: 14px 32px; border-radius: 8px; transition: background-color 0.2s;">
                                                    Go to Dashboard
                                                </a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Features -->
                            <tr>
                                <td style="padding: 0 40px 30px 40px;">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; padding: 20px;">
                                        <tr>
                                            <td style="color: #475569; font-size: 14px; line-height: 1.5;">
                                                <strong>🌟 Pro Tip:</strong> Head over to the Watchlist tab to explore live market prices and track your favorite stocks before executing your first paper trade.
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td align="center" style="background-color: #f9fafb; padding: 30px 20px; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                                        Happy trading,<br><strong>The TradeX Team</strong>
                                    </p>
                                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                        &copy; 2024 TradeX. All rights reserved.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """
        
        # Attach both plain text and HTML alternatives
        msg.attach(MIMEText(text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        # Connect to Google's SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        
        # Send and quit
        text = msg.as_string()
        server.sendmail(SMTP_EMAIL, to_email, text)
        server.quit()
        
        print(f"Sent welcome email successfully to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
