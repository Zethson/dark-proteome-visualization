import json

from flask import render_template

from dark_proteome_visualization.model.parser.dark_proteins_parser import parse_dark_proteins
from dark_proteome_visualization.model.parser.dark_proteome_parser import parse_dark_proteome
from ..app import app


@app.route("/distribution")
def distribution():
    dark_proteomes = parse_dark_proteome()
    dark_proteins = parse_dark_proteins()
    return render_template("distribution.html",
                           dark_proteomes=json.dumps(dark_proteomes, default=lambda x: x.__dict__),
                           dark_proteins=json.dumps(dark_proteins, default=lambda x: x.__dict__))
