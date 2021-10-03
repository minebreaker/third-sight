import classNames from "classnames"
import React from "react"
import { createUseStyles } from "react-jss"


const useStyles = createUseStyles( {
  tabs: {
    "display": "grid",
    "grid-template-columns": "1fr 1fr"
  },
  tab: {
    "padding": "auto 1em",  // Paddings for when the view is too small
    "vertical-align": "center",
    "background-color": "#0c0c0d",
    "cursor": "pointer"
  },
  selected: {
    "background-color": "#4a4a4f"
  },
  centering: {
    "display": "flex",
    "justify-content": "center"
  }
} )

export type States = "history" | "birdseye"
export type SwitchProps = {
  state: States
  onClick: ( nextState: States ) => void
}

export function Tab( props: SwitchProps ): React.ReactElement {

  const classes = useStyles()

  return (
      <div className={classes.tabs}>
        <div className={classNames( classes.tab, props.state === "history" && classes.selected )}
             onClick={() => props.onClick( "history" )}>
          <p className={classes.centering}>History</p>
        </div>
        <div className={classNames( classes.tab, props.state === "birdseye" && classes.selected )}
             onClick={() => props.onClick( "birdseye" )}>
          <p className={classes.centering}>Bird's Eye</p>
        </div>
      </div>
  )
}
