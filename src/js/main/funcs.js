const funcs = {}

/*!
 * Get all of an element's parent elements up the DOM tree
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   elem     The element
 * @param  {String} selector Selector to match against [optional]
 * @return {Array}           The parent elements
 */

funcs.getParents = (elem, selector) => {
  // Setup parents array
  const parents = []
  let el = elem
  // Get matching parent elements
  while (el && el !== document) {
    // If using a selector, add matching parents to array
    // Otherwise, add all parents
    if (selector) {
      if (el.matches(selector)) {
        parents.push(el)
      }
    } else {
      parents.push(el)
    }

    // Jump to the next parent node
    el = el.parentNode
  }

  return parents
}

module.exports = funcs
module.exports.default = funcs
