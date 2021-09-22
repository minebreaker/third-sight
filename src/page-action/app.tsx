import _ from "lodash"
import React, { useCallback, useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import { EVENT_NAVIGATE, EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "../events"
import { History } from "../store"
import { HistoryView } from "./history"


const useStyles = createUseStyles( {
  "@global": {
    body: {
      "background-color": "#4a4a4f",
      "color": "#f9f9fa"
    }
  },
  messageOnly: {
    "margin": "1em",
    "font-size": "15px"
  }
} )


export function App(): React.ReactElement {

  const classes = useStyles()

  const [ histories, setHistories ] = useState<History[]>()

  useEffect( () => {
        browser.runtime.sendMessage( { event: EVENT_REQUEST_HISTORY } ).then( ( message: any ) => {
          if ( message.event === EVENT_RESPONSE_HISTORY ) {
            const histories = message.history as History[]
            console.debug( histories )
            setHistories( histories )

          } else {
            console.debug( message )
            console.debug( "unknown message" )
          }
        } )
      }, []
  )

  const navigate = useCallback( ( url: string ) => {
    browser.runtime.sendMessage( { event: EVENT_NAVIGATE, url } ).then( () => {
      window.close()
    } )
  }, [] )

  const navigateWithNewTab = useCallback( ( e: React.MouseEvent, url: string ) => {
    if ( e.button === 1 ) { // Middle button clicked
      browser.runtime.sendMessage( { event: EVENT_NAVIGATE, url, newTab: true } ).then()
    }
  }, [] )


  if ( histories === undefined ) {
    return <p className={classes.messageOnly}>Loading...</p>
  } else if ( _.isEmpty( histories ) ) {
    return <p className={classes.messageOnly}>The history is empty</p>
  } else {
    return (
        <div>
          <HistoryView histories={histories} onClick={navigate} onAuxClick={navigateWithNewTab} />
        </div>
    )
  }
}
