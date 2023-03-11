## Introduction

The purpose of this project is to provide a django project template with authorization, authentication, etc. This template can be used by anyone. The template is fully customizable.

The template is based on django 4.1 and python 3.9.

## Main features
- App with custom user model
- Forms
  - Authorization
  - Registration
  - Password change
  - Password reset 
  - Password reset confirm
- All html Templates for registration, authorization, etc.
- JS form validators
- ReCaptcha v2 (checkbox)
- PostgreSQL
- The project supports 6 languages: de, fr, ja, ru, tr, uk (translated using GT).

## Forms

All forms are submitted using Ajax. Implemented a little spam protection for sending requests from forms:
all "submit" buttons have been converted into regular buttons, which check all filled fields for errors before submitting. Example: 1 field is not filled, 2 is filled, but with an error - when you click on the "submit" button, the form will not be sent until the user fills in *all the fields correctly*.

### *Authorization*

Includes next fields:
- Username
- Password
- "Remember me" checkbox

Authorization is carried out by username or email. When you try to log into an account with unconfirmed mail, a confirmation email is sent again. There is a context processor for the login modal window on any page of the site.

### *Registration*

Includes next fields: 
- Username
- Email
- Password1
- Password2
- Captcha
- Accepting the privacy policy

Immediately after registration, an email is sent to the specified address.

### *Password change*

Includes next fields:
- Old password
- New password
- New password confirmation

You cannot change the password to the current one.

### *Password reset*

Includes next fields:
- Email
- Captcha

If the specified email address exists in the database, an email is sent.

### *Password reset confirm*

Includes next fields:
- New password
- New password confirmation

## Sending letters

All emails (confirmation of the email and password reset) are sent using celery + redis.<br>
There is also protection against an attack on sending emails: a delay that is configured in settings.py

## Project Settings
All project settings are taken from the "conf.txt" file.
The repository has a file "confEXAMPLE.txt" - with a minimum of constants.

## Getting Started

Since the project is made on PostgreSQL, you must have it [installed](https://www.postgresql.org/download/). You can also use another [database](https://docs.djangoproject.com/en/4.1/ref/databases/.).

You also need to install the [redis](https://redis.io/docs/getting-started/) broker. If you use another broker, then the settings in settings.py will be different + another pip library

Create db
