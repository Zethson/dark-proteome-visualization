import rapidjson as json

from flask import render_template

from ..app import app, dark_proteomes_json, dark_proteins_json


@app.route("/copy")
def copy():
    return render_template("copy.html",
                           dark_proteomes=dark_proteomes_json,
                           dark_proteins=dark_proteins_json)
