from Project.celery import app
from user.utils import send_email_for_verify, send_mail


@app.task(default_retry_delay=5, soft_time_limit=1000)
def send_email_for_verify_celery(domain, user_id):
    """Sending a confirmation email"""
    send_email_for_verify(domain, user_id)


@app.task(default_retry_delay=5, soft_time_limit=1000)
def send_email_for_reset_celery(context, to_email):
    """Sending an email to reset password"""
    send_mail(context, to_email)


