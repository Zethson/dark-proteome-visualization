from flask import request, render_template
from flask_mail import Mail
from flask_mail import Message
from ..app import app


@app.route('/contact_request', methods=['POST'])
def contact_request():
    mail = Mail(app)
    msg = Message("Dark Proteome Request by: " + request.form['name'],
                  sender=request.form['email'],
                  recipients=['lukas.heumos@gmail.com'])
    sent_by = "The request was sent by: " + request.form['name'] + " with the contact e-mail: " + request.form['email'] + "\n\n"
    message = "His/her message is: " + request.form['message']
    msg.body = sent_by + message
    mail.send(msg)
    return render_template("index.html")