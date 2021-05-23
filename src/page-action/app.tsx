import _ from "lodash"
import { DateTime } from "luxon"
import React, { useCallback, useEffect, useState } from "react"
import { createUseStyles } from "react-jss"
import { EVENT_NAVIGATE, EVENT_REQUEST_HISTORY, EVENT_RESPONSE_HISTORY } from "../events"
import { History } from "../store"
import classNames from "classnames"


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
  },
  cardList: {
    "overflow-x": "hidden"
  },
  card: {
    "width": 480,
    "margin-bottom": "2em",
    "cursor": "pointer"
  },
  cardImage: {
    "display": "block",
    "width": 480,
    "height": 270,
    "object-fit": "cover"
  },
  cardMessage: {
    "display": "block",
    "margin-top": "0.4em"
  },
  cardFavicon: {
    "width": 16,
    "height": 16,
    "object-fit": "cover",
    "margin-right": "0.2em",
    "vertical-align": "middle"
  },
  cardMessageBase: {
    "margin": 0,
    "padding": "0 1em",
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    "overflow": "hidden"
  },
  cardMessageTitle: {
    "font-size": "17px",
    "font-weight": 600
  },
  cardMessageBody: {
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
    browser.runtime.sendMessage( { event: EVENT_NAVIGATE, url } ).then( () => {
      window.close()
    } )
  }, [] )

  const onAuxClick = useCallback( ( e: React.MouseEvent, url: string ) => {
    if ( e.button === 1 ) { // Middle button clicked
      browser.runtime.sendMessage( { event: EVENT_NAVIGATE, url, newTab: true } ).then()
    }
  }, [] )

  return (
      <div>
        {histories === undefined
            ? <p className={classes.messageOnly}>Loading...</p>
            : _.isEmpty( histories )
                ? <p className={classes.messageOnly}>The history is empty</p>
                : (
                    <div className={classes.cardList}>
                      {histories.map( history => (
                          <div key={history.timestamp}
                               className={classes.card}
                               onClick={() => onClick( history.tab.url )}
                               onAuxClick={e => onAuxClick( e, history.tab.url )}>
                            <img src={history.objectUrl}
                                 className={classes.cardImage}
                                 alt="tab thumbnail" />
                            <div className={classes.cardMessage}>
                              <p className={classNames( classes.cardMessageBase, classes.cardMessageTitle )}>
                                <img src={history.faviconUrl} alt="" className={classes.cardFavicon} />
                                {history.tab.title}
                              </p>
                              <p className={classNames( classes.cardMessageBase, classes.cardMessageBody )}>
                                {history.tab.url}<br />
                                {DateTime.fromMillis( history.timestamp ).toLocaleString( DateTime.DATETIME_MED_WITH_SECONDS )}
                              </p>
                            </div>
                          </div>
                      ) )}
                    </div>
                )
        }
      </div>
  )
}
