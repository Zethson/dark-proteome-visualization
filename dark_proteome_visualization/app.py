import logging
import os
import configparser
import rapidjson as json
from flask import Flask

from dark_proteome_visualization.model.parser.dark_proteins_parser import parse_dark_proteins
from dark_proteome_visualization.model.parser.dark_proteome_parser import parse_dark_proteome

console = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console.setFormatter(formatter)
LOG = logging.getLogger("App")
LOG.addHandler(console)
LOG.setLevel(logging.INFO)

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

dark_proteomes = parse_dark_proteome()
dark_proteins = parse_dark_proteins()
LOG.info("Serializing parsed data")
dark_proteomes_json = json.dumps(dark_proteomes, default=lambda x: x.__dict__)
dark_proteins_json = json.dumps(dark_proteins, default=lambda x: x.__dict__)
LOG.info("Successfully serialized parsed data")

from . import handlers
