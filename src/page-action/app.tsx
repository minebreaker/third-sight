import _ from "lodash"
import React, { useCallback, useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import { EVENT_NAVIGATE, EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "../events"
import { History } from "../store"
import { HistoryView } from "./history"
import { Separator } from "./separator"
import { States, Tab } from "./tab"


const useStyles = createUseStyles( {
  "@global": {
    body: {
      "background-color": "#38383d",
      "color": "#ffffff"
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

  // Sync histories on popup
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

  const navigateWithNewTab = useCallback( ( url: string ) => {
      browser.runtime.sendMessage( { event: EVENT_NAVIGATE, url, newTab: true } ).then()
  }, [] )

  const [ state, setState ] = useState<States>( "history" )

  if ( histories === undefined ) {
    return <p className={classes.messageOnly}>Loading...</p>
  } else if ( _.isEmpty( histories ) ) {
    return <p className={classes.messageOnly}>The history is empty</p>
  } else {
    return (
        <div>
          <Tab state={state} onClick={setState} />
          <Separator />
          {state === "history" && (
              <HistoryView histories={histories} onNavigate={navigate} onNavigateWithNewTab={navigateWithNewTab} />
          )}
          {state === "birdseye" && (
              <p>You're flying like a bird!</p>
          )}
        </div>
    )
  }
}
