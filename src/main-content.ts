import { EVENT_LOAD } from "./events"


declare const browser: any  // FIXME

console.debug( "content script loaded" )
browser.runtime.sendMessage( { event: EVENT_LOAD } ).then()
