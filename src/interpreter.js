const core = require('folktale/core')
const parent = Symbol.for('parent')
const evalExpression = require('./evaluator')

//Add a reference to a parent scope.
const traverse = (obj, parentScope, f) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      obj[key] = f(obj[key], obj)
      traverse(obj[key], obj, f)
    }
  })
}

const standardLib = require('./standard-lib')

module.exports = (expression) => {
  //Build lexical scope and execute expression with no arguments and context
  standardLib.$return = expression
  traverse(standardLib, undefined, (obj, parentScope) => {
    if (Array.isArray(obj) && parentScope.$eval !== 'List') {
      obj = {$eval:'List', value:obj}
    }
    Object.defineProperty(obj, parent, {configurable: true, ennumerable: false, value: parentScope})
    return obj
  })
  return evalExpression(expression, {}, {})
}
