# vlc-remote
A Mobile HTML5 Web interface for VLC built on Ratchet

THIS IS A PERSONNAL PROJECT WITHOUT ANY GARANTY OF WORK

VLC Remote - Mobile web interface for VLC, based on the Lua embedded web server in VLC
It uses only html5 and jQuery 1.11.
An active internet connection is required for this to work (CDN for jQuery)

PRE REQUIES:
1. VLC > 2.1.x required with Lua support.

INSTALL
1. Extract this archive anywhere you can retrieve it, and remember the path.
2. Activate the Web Interface in Preferences > Main interface > check "Web"
3. Overwrite the default web interface : Expand the Main interface tree and
select the "Lua" setting
4. In the section Lua HTTP : define a password
5. and put in the source folder input the path where you extracted the archive
just before.
6. Go http://localhost:8080 or, on a (w)LAN network, go remote 
http://your_ip_address:8080
7. A prompt for username and password, leave username empty, and fill
the password with what you entered before.
8. Enjoy.

Tutorial with screenshots can be found here : 
http://www.howtogeek.com/117261/how-to-activate-vlcs-web-interface-control-vlc-from-a-browser-use-any-smartphone-as-a-remote/

* TIPS 
You can emulate an app on your android phone by browsing to the VLC remote locally,
and then hit the "more" button > Add to Home Screen.
This might work also on WPhone and iOS, but because I don't know how to do.