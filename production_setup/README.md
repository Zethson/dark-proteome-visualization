1. SSH into server as root (if no user with superuser privileges exists) 

2. Install and configure ngnix on your server. Digitaloceans tutorials may help.

2. Create an account with superuser privileges if not yet existing:
```bash
$ adduser <username>

$ usermod -aG sudo <username>

$ su <username>
```

3. Clone the code and start the deployment script! Ensure beforehand that the user account and the URL are still matching!
```bash
$ cd ~

$ git clone https://github.com/Zethson/dark-proteome-visualization
```
Substitute the URL given in dark-proteome-visualization/production_setup/dark_proteome_visualization with your domains    
Substitute the username in the dark-proteome-visualization/production_setup/dark_proteome_visualization.service file.    
You may need to substitute the port.    
Rename the username given in the dark-proteome-visualization/production_setup/setup.sh script to match your home folder.
```bash
$ sudo bash dark-proteome-visualization/production_setup/setup.sh
```