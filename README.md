vlc-remote
==========

A Mobile HTML5 Web interface for VLC built on Ratchet

**THIS IS A PERSONNAL PROJECT WITHOUT ANY GARANTY OF WORK**

VLC Remote - Mobile web interface for VLC, based on the Lua embedded web server in VLC.
*It uses only HTML5 and Javascript with AngularJS v1.4.6*


INSTALL
-------
**Dependancies :**
 - VLC > 2.1.x required with Lua support.
 
1. Download as zip and extract, or git clone this repo anywhere you can
   retrieve it, and remember the path to it
2. Activate the Web Interface in Preferences > Main interface > check "Web"
3. Overwrite the default web interface : Expand the Main interface tree and select the "Lua" setting
4. In the section Lua HTTP : define a password
5. and put in the source folder input the path where you extracted the archive just before.
6. Go http://localhost:8080 or, on a (w)LAN network, go remote  http://your_ip_address:8080
7. A prompt for username and password, leave username empty, and fill the password with what you entered before.
8. Enjoy.

Tutorial with screenshots can be found [here](http://www.howtogeek.com/117261/how-to-activate-vlcs-web-interface-control-vlc-from-a-browser-use-any-smartphone-as-a-remote/).

TIPS
----

 
* You can emulate an app on your android phone by browsing to the VLC remote locally,
and then hit the "more" button > Add to Home Screen.
* This might work also on WPhone and iOS, but because I don't know how to do.

SCREENSHOTS
-----------

(with french locale)

![Screenshot 1](https://cdn.img42.com/599437258cafff8b2ba3de58ca2661b0.png)  ![Screenshot 2](https://cdn.img42.com/f0675817a624d2e1c918f22373be7ce6.png) 
![Screenshot 3](https://cdn.img42.com/a788706e2ff7597d9e2a2aa623cb04dd.png)  ![Screenshot 4](https://cdn.img42.com/7821748bf0bad418f5ac50727b1cb4b9.png)  
![Screenshot 5](https://cdn.img42.com/38c8fad330b06d9810f815ae4f0977c8.png)  ![Screenshot 6](https://cdn.img42.com/e5e734837ebf9f51248e4514137950d7.png)  
![Screenshot 7](https://cdn.img42.com/af5462b943bd250f3f72442c201c4cfe.png)

Write a locale
----
 * Clone the latest
 * Create a new file in js/locales/[ln].json, where ln is the language code, as en, fr, de, es, it, ru etc...
 * Copy and Paste the content of "en.json" file.
 * Fill, replace and translate entries.
 * When done, git commit and request a new pull. Name it angular-translate-[ln] with your locale.
 * It will be merged to the main branch later after checkup.

TODO
----
 * Multi-lang support for Streams.
 * Write more locales
 * Equalizer
 * Rewrite history.pushback using clean directives
 * Streaming live from VLC support ?
