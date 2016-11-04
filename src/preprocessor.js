const parent = Symbol.for('parent')

const traverse = (obj, parentScope, f) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      obj[key] = f(obj[key], obj)
      traverse(obj[key], obj, f)
    }
  })
  return obj 
}

module.exports = (expression) => 
  traverse(expression, undefined, (obj, parentScope) => {

    //Move arguments to the $with object
    if ((obj.$eval !== undefined || obj.$curry !== undefined) && obj.$with === undefined) {
      const args = Object.assign({}, obj)
      delete args.$eval
      delete args.$from
      delete args.$curry
      delete args.$if
      obj.$with = args
    }
    
    //Convert arrays to Junktion lists
    if (Array.isArray(obj) && parentScope.value !== obj) {
      obj = {$eval:'List', $with: {value:obj}}
    }

    //Convert 'curry' expressions to lambdas
    if(obj.$curry !== undefined) {
      debugger
      obj = {
        _with: obj.$with,
        $return: {
          $eval: obj.$curry,
          $with:'_with'
        }
      }  
    }
    
    //Build lexical scope
    Object.defineProperty(obj, parent, {configurable: true, ennumerable: false, value: parentScope})
    
    return obj
  })
