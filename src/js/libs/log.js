const debug = process.env.NODE_ENV === 'development'

const log = (msg) => {
  if (debug) {
    console.log(msg)
  }
}

module.exports = log
