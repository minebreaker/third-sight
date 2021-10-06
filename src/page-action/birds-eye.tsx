import _ from "lodash"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { createUseStyles } from "react-jss"
import { History, Store } from "../store"
import { CardList } from "./card"


const useStyles = createUseStyles( {
  inputWrapper: {
    "margin": "4px"
  },
  input: {
    "display": "block",
    "width": "100%",
    "background-color": "#4a4a4f",
    "color": "#ffffff",
    "border": "none",
    "border-radius": "2px",
    "&:focus": {
      "outline": "none"
    }
  }
} )

export type BirdsEyeProps = {
  store: Store,
  activeTab?: Tab
  onNavigate: ( tabId: number ) => void
}

export function BirdsEye( props: BirdsEyeProps ): React.ReactElement {

  const classes = useStyles()

  const [ query, setQuery ] = useState( "" )
  const tabEntries: History[] = useMemo(
      () => (
          Object.entries( props.store )
                .flatMap( ( [ , h ] ) => _.last( h ) || [] )
                .filter( t => t.tab.id !== props.activeTab?.id )
      ),
      [ props.store, props.activeTab ]
  )
  const queriedTabEntries = query
      // TODO: use some fuzzy search libraries
      ? tabEntries.filter( tab => tab.tab.title.includes( query ) || tab.tab.url.includes( query ) )
      : tabEntries

  // Focus input on the component creation
  const inputRef = useRef<HTMLInputElement>( null )
  useEffect( () => {
    inputRef.current?.focus()
  }, [ inputRef ] )

  return (
      <div>
        <div className={classes.inputWrapper}>
          <input ref={inputRef}
                 type="text"
                 className={classes.input}
                 onChange={e => setQuery( e.target.value )}
                 placeholder="query" />
        </div>
        <CardList histories={queriedTabEntries}
                  onNavigate={tab => tab.id && props.onNavigate( tab.id )}
                  onNavigateWithNewTab={_.noop} />
      </div>
  )
}
