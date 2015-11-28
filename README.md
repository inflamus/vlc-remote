# vlc-remote
A Mobile HTML5 Web interface for VLC built on Ratchet

THIS IS A PERSONNAL PROJECT WITHOUT ANY GARANTY OF WORK

VLC Remote - Mobile web interface for VLC, based on the Lua embedded web server in VLC
It uses only html5 and jQuery 1.11.
An active internet connection is required for this to work (CDN for jQuery)

PRE REQUIES:
* VLC > 2.1.x required with Lua support.

INSTALL
* Download as zip and extract, or git clone this repo anywhere you can retrieve it, and remember the path to it.
* Activate the Web Interface in Preferences > Main interface > check "Web"
* Overwrite the default web interface : Expand the Main interface tree and select the "Lua" setting
* In the section Lua HTTP : define a password
* and put in the source folder input the path where you extracted the archive just before.
* Go http://localhost:8080 or, on a (w)LAN network, go remote 
http://your_ip_address:8080
* A prompt for username and password, leave username empty, and fill the password with what you entered before.
* Enjoy.

Tutorial with screenshots can be found here : 
http://www.howtogeek.com/117261/how-to-activate-vlcs-web-interface-control-vlc-from-a-browser-use-any-smartphone-as-a-remote/

TIPS 
* You can emulate an app on your android phone by browsing to the VLC remote locally,
and then hit the "more" button > Add to Home Screen.
* This might work also on WPhone and iOS, but because I don't know how to do.
TIPS 
* You can emulate an app on your android phone by browsing to the VLC remote locally,
and then hit the "more" button > Add to Home Screen.
* This might work also on WPhone and iOS, but because I don't know how to do.

SCREENSHOTS
http://s15.postimg.org/5rfnrk9ln/Screenshot_2015_11_28_18_52_38.png
http://s8.postimg.org/j65vsugt1/Screenshot_2015_11_28_18_51_15.png
http://s10.postimg.org/4ux9gj3eh/Screenshot_2015_11_28_18_51_44.png
http://s10.postimg.org/damty169l/Screenshot_2015_11_28_18_51_52.png
http://s10.postimg.org/5vxi5nke1/Screenshot_2015_11_28_18_52_20.png

TODO
* full rewrite with angular for a cleaner js code (this one is ugly i know it)
* rewrite interface with distinct buttons for chapters / seek / next
* Position seeking and progress bar
* Add subs/audio synchro support