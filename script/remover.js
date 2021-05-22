const fs = require( 'fs' )


// String.prototype.replaceAll requires Node15+
const replaceAll = ( s, f, t ) => {
  const newS = s.replace( f, t )
  if ( newS === s ) {
    return newS
  }

  return replaceAll( newS, f, t )
}

function replace( file, from, to, cb ) {
  fs.readFile( file, 'utf8', function ( e, data ) {
    if ( e ) {
      throw e
    }

    const result = replaceAll( data, from, to );

    fs.writeFile( file, result, 'utf8', function ( e ) {
      if ( e ) {
        throw e
      }

      cb()
    } );
  } );
}

const from1 = /Function\(['"]return this['"]\)/
const to1 = "(function(){throw new Error(\"fatal attempt to get global\")})"
const from2 = /[\w{0,31}]\.innerHTML/ //
const to2 = "var _"
const from3 = /"<svg>"\+[\w]\.valueOf\(\)\.toString\(\)\+"<\/svg>"/  // special treat for the production build
const to3 = "\"<p>build error!</p>\""

console.info( "Executing remover script..." )
replace( "./build/out/background.js", from1, to1, () => {
  replace( "./build/out/page-action.js", from1, to1, () => {
    replace( "./build/out/page-action.js", from2, to2, () => {
      replace( "./build/out/page-action.js", from3, to3, () => {
        console.info( "Remover end." )
      } )
    } )
  } )
} )