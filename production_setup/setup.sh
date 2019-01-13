#!/bin/bash
# Reference:
# https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-gunicorn-and-nginx-on-ubuntu-18-04

apt-get update

apt-get install python3-pip python3-dev nginx

pip3 install virtualenv

cd ~

git clone https://github.com/brettvanderwerff/dark-proteome-visualization

cd dark-proteome-visualization

virtualenv dpenv

source dpenv/bin/activate

pip install gunicorn

python setup.py clean --all install

cp /home/zeth/dark-proteome-visualization/production_setup/dark_proteome_visualization.service \
/etc/systemd/system/dark_proteome_visualization.service

systemctl start dark_proteome_visualization

systemctl enable dark_proteome_visualization

cp /home/zeth/dark-proteome-visualization/production_setup/dark_proteome_visualization \
/etc/nginx/sites-available/dark_proteome_visualization

ln -s /etc/nginx/sites-available/dark_proteome_visualization /etc/nginx/sites-enabled

nginx -t

systemctl restart nginx

ufw delete allow 5000

ufw allow 'Nginx Full'







