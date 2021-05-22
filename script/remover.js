/*

This script removes followings from the code
so that `web-ext` will not warn.

* `Function("return this")` eval statement
* `.innerHTML =` assignment

 */

const { replaceFile } = require( "./utils" )


const from1 = /Function\(['"]return this['"]\)/
const to1 = "(function(){throw new Error(\"fatal attempt to get global\")})"
const from2 = /\.innerHTML ?=/
const to2 = ".undefined ="

async function main() {
  console.info( "Executing remover script..." )
  await replaceFile( "./build/out/background.js", from1, to1 )
  await replaceFile( "./build/out/page-action.js", from1, to1 )
  await replaceFile( "./build/out/page-action.js", from2, to2 )
  console.info( "Remover end." )
}

main().then()
