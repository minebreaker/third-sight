import _ from "lodash"
import { DateTime } from "luxon"
import React, { useCallback, useEffect, useState } from "react"
import { EVENT_NAVIGATE, EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "../events"
import { History } from "../store"


declare const browser: any  // FIXME

export function App() {

  const [ histories, setHistories ] = useState<History[]>()

  useEffect( () => {
        browser.runtime.sendMessage( { event: EVENT_REQUEST_HISTORY } ).then( ( message: any ) => {
          if ( message.event === EVENT_RESPONSE_HISTORY ) {
            const histories = message.history as History[]
            console.debug( histories )
            setHistories( _.chain( histories )
                           .dropRight( 1 )  // Removes current page
                           .sortBy( history => history.timestamp )
                           .reverse()
                           .value() )

          } else {
            console.debug( message )
            console.debug( "unknown message" )
          }
        } )
      }, []
  )

  const onClick = useCallback( ( url: string ) => {
    console.log( "clicked" )
    browser.runtime.sendMessage( { event: EVENT_NAVIGATE, url } ).then( () => {
      window.close()
    } )
  }, [] )

  const onAuxClick = useCallback( ( e: React.MouseEvent, url: string ) => {
    console.log( "aux clicked" )
    if ( e.button === 1 ) { // Middle button clicked
      browser.runtime.sendMessage( { event: EVENT_NAVIGATE, url, newTab: true } ).then()
    }
  }, [] )

  return (
      <div>
        {histories === undefined
            ? <p>Loading...</p>
            : _.isEmpty( histories )
                ? <p>The history is empty</p>
                : histories.map( history => (
                    <div key={history.timestamp}
                         style={{ margin: "4px", border: "solid 1px black", cursor: "pointer" }}
                         onClick={() => onClick( history.tab.url )}
                         onAuxClick={e => onAuxClick( e, history.tab.url )}>
                      <div style={{ margin: "4px" }}>
                        <img src={history.objectUrl}
                             style={{
                               width: 320,
                               height: 180,
                               objectFit: "cover"
                             }}
                             alt="tab thumbnail" />
                      </div>
                      <p style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        paddingRight: "1em",
                        overflow: "hidden"
                      }}>
                        {history.tab.title}<br />
                        {history.tab.url}<br />
                        {DateTime.fromMillis( history.timestamp ).toLocaleString()}
                      </p>
                    </div>
                ) )
        }
      </div>
  )
}
