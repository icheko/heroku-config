// interface for reading/writing to .env file
'use strict'

const fs = require('mz/fs')
const DEFAULT_FNAME = '.env'

function obj_to_file_format (obj) {
  let res = ''
  for (let key in obj) {
    // there's a bug including newlines in template string
    res += (`${key}="${obj[key]}"` + '\n')
  }
  return res
}

function obj_from_file_format (s) {
  let res = {}
  let data = s.split('\n')
  console.log(data)
  data.forEach(function (v) {
    let config = v.match(/^([A-Za-z0-9_]+)="?(.*)$/)
    if (config) {
      let key = config[1]
      // strip off trailing " if it's there
      let value = config[2].replace(/"$/, '')
      if (res[key]) { console.warn(`WARN - ${key} is in env file twice`) }
      res[key] = value
    }
  })
  return res
}

module.exports = {
  read: (fname) => {
    fname = fname || DEFAULT_FNAME
    // let data = fs.readFileSync(fname, 'utf-8')
    return fs.readFile(fname, 'utf-8').then((data) => {
      return Promise.resolve(obj_from_file_format(data))
    }).catch(() => {
      // console.warn(`WARN - Unable to read from ${fname}`)
      // if it doesn't exist or we can't read, just start from scratch
      return Promise.resolve({})
    })
  },
  write: (obj, fname) => {
    fname = fname || DEFAULT_FNAME
    fs.writeFile(fname, obj_to_file_format(obj)).then(() => {
      console.log(`Successfully wrote config to ${fname}!`)
    }).catch((err) => {
      console.error(`Error writing to file ${fname}: ${err.message}`)
    })
  }
}