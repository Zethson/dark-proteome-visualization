# Dark-Proteome-Visualization
[![Build Status](https://travis-ci.org/Zethson/dark-proteome-visualization.svg?branch=development)](https://travis-ci.org/Zethson/dark-proteome-visualization)

The website is accessible here:     
[Dark Proteome](http://dark-proteome.com)

More than one third of the proteins in the human proteome are entirely disordered (<b>IDPs</b>) or contain long intrinsically disordered regions (<b>IDRs</b>).<br />
They cannot be characterized by the traditional methods of structural biology and therefore pose an interesting challenge. <br />
This website serves as an information source for the <i>dark proteome.</i>

# Local Setup
```
$ rename the mail_stub.conf in dark_proteome_visualization/static to mail.conf
$ overwrite the stub values in mail.conf with a gmail account 
$ enable less secure applications in your gmail account
$ python setup.py clean --all install
$ dark_proteome_visualization -l 127.0.0.1
```
Steps 2 and 3 are <b>voluntary</b>, but step 2 <b>depends</b> on 3! Less secure applications need to be enabled to receive and send messages in any forms.       
Point your browser to http://127.0.0.1:5000/    

# Production Setup
A small description for the production setup (there are setup scripts provided) is given here: [Production Setup](production_setup/README.md)
