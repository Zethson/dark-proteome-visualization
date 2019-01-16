from flask import render_template
from ..app import app


@app.route("/explore")
def explore():
    return render_template("explore.html")
