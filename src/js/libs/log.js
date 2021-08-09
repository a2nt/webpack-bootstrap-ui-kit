var debug = process.env.NODE_ENV === 'development' ? true : false;

const log = (msg) => {
  if (debug) {
    console.log(msg);
  }
};

module.exports = log;
