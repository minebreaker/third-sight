import _ from "lodash"
import { DateTime } from "luxon"
import React, { useCallback, useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { EVENT_NAVIGATE, EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "./events"
import { History } from "./store"


declare const browser: any  // FIXME

function App() {

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

  const onAuxClick = useCallback( ( url: string ) => {
    console.log( "aux clicked" )
    browser.runtime.sendMessage( { event: EVENT_NAVIGATE, url, newTab: true } ).then()
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
                         onAuxClick={() => onAuxClick( history.tab.url )}>
                      <p style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        paddingRight: "1em",
                        overflow: "hidden"
                      }}>{history.tab.title}</p>
                      <p style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        paddingRight: "1em",
                        overflow: "hidden"
                      }}>{history.tab.url}</p>
                      <p style={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        paddingRight: "1em",
                        overflow: "hidden"
                      }}>{DateTime.fromMillis( history.timestamp ).toISO()}</p>
                      <div>
                        <img src={history.objectUrl}
                             style={{
                               width: 320,
                               height: 180,
                               objectFit: "cover"
                             }}
                             alt="tab thumbnail" />
                      </div>
                    </div>
                ) )
        }
      </div>
  )
}

ReactDOM.render(
    <App />,
    document.getElementById( "app" )
)
