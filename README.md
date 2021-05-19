# Third Sight

Browsing history with thumbnails

This FireFox extension adds browser action button to show browsing history with thumbnails


## Some design thoughts

* Since there is no reliable way to get the current session history(not entire browsing history),
  we assume that everytime content script is loaded the page is moved to another.
    * This limitation results in poor support for SPAs which uses WebHistory API like `replaceState`.
