import _ from "lodash"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { createUseStyles } from "react-jss"
import { Store } from "../store"


const useStyles = createUseStyles( {
  outer: {
    "display": "grid",
    "grid-template-columns": "repeat(auto-fill, minmax(128px, 1fr))",
    "min-width": "480px"
  },
  inputWrapper: {
    "margin": "4px"
  },
  input: {
    "background-color": "#4a4a4f",
    "color": "#ffffff",
    "border": "solid #0c0c0d 1px",
    "border-radius": "2px",
    "&:focus": {
      "outline": "none"
    }
  },
  image: {
    "display": "block",
    "width": "128px",
    "height": "72px",
    "border": "solid #4a4a4f 8px",
    "cursor": "pointer"
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
  const originalTabs = useMemo(
      () => (
          Object.entries( props.store )
                .flatMap( ( [ , h ] ) => _.last( h ) || [] )
                .filter( t => t.tab.id !== props.activeTab?.id )
      ),
      [ props.store, props.activeTab ]
  )
  const tabs = query
      // TODO: use some fuzzy search libraries
      ? originalTabs.filter( tab => tab.tab.title.includes( query ) || tab.tab.url.includes( query ) )
      : originalTabs

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
        {/* TODO: just use Card */}
        <div className={classes.outer}>
          {tabs.map( tab => (
              <img key={tab.tab.id}
                   src={tab.objectUrl}
                   alt="thumb"
                   className={classes.image}
                   onClick={() => tab.tab.id && props.onNavigate( tab.tab.id )} />
          ) )}
        </div>
      </div>
  )
}
