import logging
import rapidjson as json

from flask import render_template

from ..app import app, dark_proteomes, dark_proteins

console = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console.setFormatter(formatter)
LOG = logging.getLogger("Copy")
LOG.addHandler(console)
LOG.setLevel(logging.INFO)


@app.route("/copy")
def copy():
    LOG.info("Serializing parsed data")
    dark_proteomes_json = json.dumps(dark_proteomes, default=lambda x: x.__dict__)
    dark_proteins_json = json.dumps(dark_proteins, default=lambda x: x.__dict__)
    LOG.info("Successfully serialized parsed data")
    return render_template("copy.html",
                           dark_proteomes=dark_proteomes_json,
                           dark_proteins=dark_proteins_json)
