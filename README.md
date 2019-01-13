# dark-proteome-visualization
[![Build Status](https://travis-ci.org/Zethson/dark-proteome-visualization.svg?branch=development)](https://travis-ci.org/Zethson/dark-proteome-visualization)
# Local Setup
```
$ python setup.py clean --all install
$ dark_proteome_visualization
```

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
