import os
import configparser
from flask import Flask

CURRENT_DIR = os.path.abspath(os.getcwd())
MODULE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_PATH = os.path.join(MODULE_DIR, 'static')
TEMPLATES_PATH = os.path.join(MODULE_DIR, 'templates')

app = Flask(__name__)
config = configparser.ConfigParser()
config.read(STATIC_PATH + '/mail.conf')
mail_username = config['DEFAULT']['gmail_user_name']
mail_password = config['DEFAULT']['gmail_password']

app.config.update(
    # EMAIL SETTINGS
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_SSL=True,
    MAIL_USERNAME=mail_username,
    MAIL_PASSWORD=mail_password
)

from . import handlers
