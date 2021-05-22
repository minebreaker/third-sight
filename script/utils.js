const fs = require( 'fs/promises' )


// String.prototype.replaceAll requires Node15+
const replaceAll = ( s, f, t ) => {
  const newS = s.replace( f, t )
  if ( newS === s ) {
    return newS
  }

  return replaceAll( newS, f, t )
}

async function replaceFile( file, from, to ) {

  const data = await fs.readFile( file, 'utf8' )
  const result = replaceAll( data, from, to )
  await fs.writeFile( file, result, 'utf8' )
}

module.exports = {
  replaceFile
}
