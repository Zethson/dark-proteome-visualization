import rapidjson as json

from flask import render_template

from ..app import app, dark_proteomes, dark_proteins


@app.route("/copy")
def copy():
    return render_template("copy.html",
                           dark_proteomes=json.dumps(dark_proteomes, default=lambda x: x.__dict__),
                           dark_proteins=json.dumps(dark_proteins, default=lambda x: x.__dict__))
