from flask import render_template
from ..app import app


@app.route("/analyze")
def analyze():
    return render_template("analyze.html")
