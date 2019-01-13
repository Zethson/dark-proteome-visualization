# Dark-Proteome-Visualization
[![Build Status](https://travis-ci.org/Zethson/dark-proteome-visualization.svg?branch=development)](https://travis-ci.org/Zethson/dark-proteome-visualization)

[Dark Proteome](http://dark-proteome.com)

# Local Setup
```
$ python setup.py clean --all install
$ dark_proteome_visualization
```
Point your browser to http://0.0.0.0:5000/

# Production Setup
1. SSH into server as root (if no user with superuser privileges exists) 

2. Create an account with superuser privileges if not yet existing:
```bash
$ adduser zeth

$ usermod -aG sudo zeth

$ su zeth
```

3. Clone the code and start the deployment script! Ensure beforehand that the user account and the URL are still matching!
```bash
$ cd ~

$ git clone https://github.com/Zethson/dark-proteome-visualization

$ sudo bash dark-proteome-visualization/production_setup/setup.sh
```
