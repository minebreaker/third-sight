import classNames from "classnames"
import { DateTime } from "luxon"
import React from "react"
import { createUseStyles } from "react-jss"
import { History } from "../store"


const useStyles = createUseStyles( {
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

export function CardList( { histories, onNavigate, onNavigateWithNewTab }: {
  histories: History[],
  onNavigate: ( tab: Tab ) => void,
  onNavigateWithNewTab: ( tab: Tab ) => void
} ): React.ReactElement {

  const classes = useStyles()

  return (
      <div className={classes.cardList}>
        {histories.map( history => (
            <Card key={history.timestamp}
                  history={history}
                  onNavigate={onNavigate}
                  onNavigateWithNewTab={onNavigateWithNewTab} />
        ) )}
      </div>
  )
}

export function Card( { history, onNavigate, onNavigateWithNewTab }: {
  history: History,
  onNavigate: ( tab: Tab ) => void,
  onNavigateWithNewTab: ( tab: Tab ) => void
} ): React.ReactElement {

  const classes = useStyles()

  return (
      <div className={classes.card}
           onClick={() => onNavigate( history.tab )}
           onAuxClick={e => {
             if ( e.button === 1 ) {  // Middle button clicked
               onNavigateWithNewTab( history.tab )
             }
           }}>
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
  )
}
