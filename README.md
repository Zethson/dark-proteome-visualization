# dark-proteome-visualization
[![Build Status](https://travis-ci.org/Zethson/dark-proteome-visualization.svg?branch=development)](https://travis-ci.org/Zethson/dark-proteome-visualization)
# Production Setup
 
1. SSH into server as root

2. Execute the following commands:
```bash
$ adduser zeth

$ usermod -aG sudo zeth

$ su zeth

$ cd ~

$ git clone https://github.com/brettvanderwerff/dark-proteome-visualization

$ sudo bash dark-proteome-visualization/production_setup/setup.sh
```
