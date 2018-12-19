# screen-array

The goal of this project is to create a distributed audio responsive visual system with web technologies. Web Components, Canvas, future friendly JavaScript (ESM, ES8+), WebSockets, Web MIDI etc. An array of Raspberry Pi’s is controlled by a central server sending them instructions over WebSockets. Each Pi runs a browser in kiosk mode (full screen and automatically started at boot) which loads a web page served from the central server.
The server also serves a web page to control the Pi's can be run on a laptop.
Each client (a Raspberry Pi) is connected to one screen or projector, so the more clients the more screens you can control.
My test setup has 12 screens but I’ve not tested how many clients can be steadily used on a 1GB network.

A local network is needed to guarantee a steady communication between all Pi’s and the server. One Pi is configured as a DNS server to supply all Pi’s and the server with a static IP. This also makes it easy to SSH onto the Pi’s to update settings reboot etc.

One Pi takes care of the audio analysis, the audio is fed into the Pi from a mixer or other audio source and sends audio spectrum data back to the server so it can be distributed to the clients.

The control (the web page served to control the visuals) lets you load animations and set their properties and lets you control the visuals that run on the clients.
On the clients a <canvas> is used to show these animations.
Since a distinct simple visual language was targeted for this project the visual computational limitations of the Raspberry Pi are not an issue, it is the first bottleneck you notice while using this system though. Optimising the animations is therefor recommended.

Prepare the Raspberry Pi's
Installing Raspian on the Pi’s as described on https://www.raspberrypi.org/documentation/installation/installing-images/
You’ll need one Raspberry Pi, one micro SD card to install Raspian on, and one power supply per Pi you want to use. Later you probably want some cases for the Pi’s and some heatsinks and fans to cool the Pi’s down, but first things first.

After installing the Raspian OS on the SD card you can insert the SD card in the Pi and hook it up to the screen and mouse and keyboard to setup the Pi correctly.
* you want to enable SSH so you can control it over the network without a keyboard and mouse connected to the Pi
* change the password to prevent messages popping up
* turn of the splash screen since it’s quite bright
* you want to remove the background image from the desktop and turn the background black
* make the menubar as dark as possible

After you’ve setup some Pi’s as clients a local network is needed.

Setting up the local network and DNS server
I’ve got two 8 port switches (Netgear Prosafe GS108) taking care of the traffic and connecting all devices.
One Pi setup as a DNS server. To read an entry level lesson on how to configure a Pi as a DNS server check out: https://www.raspberrypi.org/learning/networking-lessons/lesson-3/plan/

TL:DR
install dnsmasq on one Pi

`$ sudo apt-get install dnsmasq`

Set the dnsmasq config, in file: /etc/dnsmasq.conf
```
read-ethers
interface=eth0
dhcp-range=192.168.0.10,192.168.0.254,255.255.255.0,12h
```


Connect the devices to the network and check their MAC addresses in the leases file so they can be handed the same IP when reconnecting
`$ sudo vi /var/lib/misc/dnsmasq.leases`

I’ve named them
* server
* audio
* r1, r2, r3 etc.

Make sure all clients are connected to the network and a screen to test them by seeing if you can connect to them via SSH
`$ ssh pi@r1`

You might want to copy the public key from your laptop over to the Pi’s to not have to enter the password all the time. Instructions: http://rebol.com/docs/ssh-auto-login.html. Be aware in our situation you connect from the server to the clients so the server on that page is our client and the client is our server.
TL:DR
* generate a public key
* add it to the "authorized_keys" file
* test it
You can also copy the public key over to the clients by using the ssh-copy-id homebrew application
`$ brew install ssh-copy-id`

`$ ssh-copy-id -i ~/.ssh/id_rsa.pub pi@r1`

Setting up the clients

Make some aliases to type less
`$ sudo vi ~/.bash_aliases`

copy these exact lines to the bash_aliases file
```
alias autostart='sudo vi ~/.config/lxsession/LXDE-pi/autostart'
alias lightdm='sudo vi /etc/lightdm/lightdm.conf'
alias debug='ssh -L 0.0.0.0:9223:localhost:9222 localhost -N'
alias ll='ls -Gal'
alias kill='killall chromium-browser'
alias sr='killall chromium-browser && sleep 2 && sudo reboot'
alias sd='killall chromium-browser && sleep 2 && sudo shutdown now'
alias test='chromium-browser --disable-restore-session-state --disable-extensions --disable-file-system --disable-notifications --disable-sync --disable-speech-api --enable-accelerated-2d-canvas --enable-experimental-web-platform-features --javascript-harmony --bwsi http://server:1337/client.html'
```

Then source the bashrc to be able to use the aliases in your current terminal session
`$ source ~/.bashrc`


To prevent sleep and remove cursor:
`$ lightdm`
Or when you didn’t create the aliases
`$ sudo vi /etc/lightdm/lightdm.conf`

goto line 127
`:127`

Add to SeatDefault section. Source link: http://chamaras.blogspot.com/2013/03/how-to-deactivate-monitor-sleep-in.html
```
[SeatDefaults]
xserver-command=X -s 0 -dpms -nocursor
#xserver-command=X -s 0 -dpms
```

The last line is there so you can easily switch to using a cursor when you need to use a mouse on the Pi by just uncommenting one line and commenting the other (# is used to comment out one line)
Save and close the file


To auto start chrome in kiosk mode and remove splash screen
`$ autostart`
Or when you didn’t create the aliases
`$ sudo vi ~/.config/lxsession/LXDE-pi/autostart`

copy these exact lines to the autostart file
```
@chromium-browser --show-fps-counter --disable-restore-session-state --disable-file-system --disable-notifications --disable-speech-api --enable-accelerated-2d-canvas --enable-experimental-web-platform-features --enable-experimental-canvas-features --bwsi --kiosk --remote-debugging-port=9222 http://server:1337/client.html

@lxpanel --profile LXDE-pi
#@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash
```

Save and close the file

Set resolution
`$ sudo vi /boot/config.txt`
Go to line 21
`:21`
and change the width and height of the screen (this helps a lot with performance)

```
framebuffer_width=800
framebuffer_height=600
```


Reboot and check if Chromium starts and you don’t see a cursor
`$ sudo reboot`


Setting up the server
Clone this repo 
```
$ git clone git@github.com:PM5544/screen-array.git
$ cd screen-array
$ npm i
$ npm start
```
Open a browser and go to http://localhost:1337/control.html to open the control page


I’ve got an AKAI APC mini midi controller hooked up to make it easier to control whats happening.
