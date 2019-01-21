# Dark-Proteome-Visualization
[![Build Status](https://travis-ci.org/Zethson/dark-proteome-visualization.svg?branch=development)](https://travis-ci.org/Zethson/dark-proteome-visualization)

The website is accessible here:     
[Dark Proteome](http://dark-proteome.com)

# Local Setup
```
$ rename the mail_stub.conf in dark_proteome_visualization to mail.conf
$ overwrite the stub values in mail.conf with a gmail account 
$ enable less secure applications in your gmail account
$ python setup.py clean --all install
$ dark_proteome_visualization -l 127.0.0.1
```
Steps 2 and 3 are voluntary, but step 2 depends on 3!    
Point your browser to http://127.0.0.1:5000/    

# Production Setup
A small description for the production setup (there are setup scripts provided) is given here: [Production Setup](production_setup/README.md)
