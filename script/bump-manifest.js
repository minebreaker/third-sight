/*

This script bump up the version in manifest.json

 */

const { replaceFile } = require( "./utils" )


async function main() {
  console.info( "Executing bump script..." )
  const version = process.env["npm_package_version"]
  await replaceFile( "./static/manifest.json", /"version": "[0-9.]*"/, `"version": "${version}"` )
  console.info( "Bump end." )
}

main().then()
