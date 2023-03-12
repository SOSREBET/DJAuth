## Introduction

The purpose of this project is to provide a django project template with authorization, authentication, etc. This template can be used by anyone. The template is fully customizable.

The template is based on django 4.1 and python 3.9.

## Main features

- App with custom user model
- Ajax forms
  - Authorization
  - Registration
  - Password change
  - Password reset 
  - Password reset confirm
- All html Templates for registration, authorization, etc.
- BootStrap 5
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

## Requirements

- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis](https://redis.io/docs/getting-started/)

You can also use [another database](https://docs.djangoproject.com/en/4.1/ref/databases/.) and another broker.

> Note that requirements.py already contains libraries for working with PostgreSQL and Redis.

## Getting Started

1. Create a PostgreSQL database, then exit postgres (CTRL + d):
  
  ```bash
  foo@bar:~$ sudo -i -u postgres
  postgres@bar:~$ createdb Auth
  ```
  
2. Create a virtual environment and activate it:

  ```bash
  foo@bar:~$ python3.9 -m venv venv
  foo@bar:~$ source venv/bin/activate
  ```

3. Clone the repository from Github and switch to the new directory:
  ```bash
  (venv) foo@bar:~$ git clone https://github.com/SOSREBET/DJAuth
  (venv) foo@bar:~$ cd DJAuth/
  ```

4. Install project dependencies:
  
  ```bash
  (venv) foo@bar:~/DJAuth$ pip install -r requirements.txt
  ```

5. Rename "confEXAMPLE.txt" to "conf.txt" and **fill in each field**:

  ```bash
  (venv) foo@bar:~/DJAuth$ mv confEXAMPLE.txt conf.txt
  ```

  You can get the values for `RECAPTCHA_PUBLIC_KEY` and `RECAPTCHA_PRIVATE_KEY` [here](https://www.google.com/recaptcha/admin).

  If you want to use Console Backend sending email [see here](https://docs.djangoproject.com/en/4.1/topics/email/#console-backend).

6. Create migrations and apply them:

  ```bash
  (venv) foo@bar:~/DJAuth$ python3 manage.py makemigrations
  (venv) foo@bar:~/DJAuth$ python3 manage.py migrate
  ```

7. Now you can start the server:

  ```bash
  (venv) foo@bar:~/DJAuth$ python3 manage.py runserver
  ```
  
  To send emails you need to open 2 more terminal windows.

  Start Redis in the first window

  ```bash
  foo@bar:~$ sudo service redis-server start
  foo@bar:~$ redis-cli
  ```

  In the second run celery worker (*don't forget to activate virtual environment*)

  ```bash
  (venv) foo@bar:~/DJAuth$ celery -A Project worker -l info
  ```

Bug reports are welcome
