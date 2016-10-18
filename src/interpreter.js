const core = require('folktale/core')
const resolver = require('./resolve')

const logExecution = (expression, context, args) => {
  console.log(`Executing ${JSON.stringify(expression)}
  with context
    ${JSON.stringify(context)}
  with arguments
    ${JSON.stringify(args)}
    `)
}


const parent = Symbol.for('parent')


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

const resolveExpression = (expression, context, args) => {
  const resolve = resolver(expression, context, args) 

  var newExpression = {}
  Object.keys(expression).forEach((key) => {

    if(typeof expression[key] === 'string') {
      newExpression[key] = resolve(expression[key])
    } else {
      newExpression[key] = expression[key]
    }
  })
  return newExpression
  /*
  if (Object.keys(newExpression).length !== 0) {
    Object.defineProperty(newExpression, parent, 
        {configurable: true, ennumerable: false, value: expression[parent]})
    return newExpression
  } else {
    return expression
  }
  */
}

const evalArray = (expression, context, args) => expression.map((expression) => evalExpression(expression, context, args)) 

const evalContext = (expressionRaw, oldContext, args) => {
  const $from = expressionRaw['$from'] 
  return $from !== undefined ? evalExpression($from, oldContext, args) : oldContext
}

const evalObjectExpression = (expression, context, args) => {
    const newContext = evalContext(expression, context, args)
    const newExpression = resolveExpression(expression, newContext, args)
    return evalS(newExpression, newContext, args)
}


const evalS = (expression, context, args) => {
  
  const $if = expression['$if'] 
  const $then = expression['$then'] 
  const $else = expression['$else'] 

  const $eval = expression['$eval'] 
  const $with = expression['$with'] 
  const $curry = expression['$curry'] 

  const $return = expression['$return'] 
//  console.log('Resolved expression to', expression)

  //Exec the expression, depending on its type
  if (typeof $if !== 'undefined') {
    return evalExpression($if, context, args) ? evalExpression($then, context, args)
          :                                     evalExpression($else, context, args)
  } else if (typeof $return !== 'undefined') {
    return evalExpression($return, context, args)
  } else if (typeof $curry === 'object') {
    const curriedExpression = $curry
    const curriedArgs = evalArguments(expression, context, args)
    return {
      $eval: (env, args) => {
        return evalExpression(curriedExpression, env, Object.assign({}, curriedArgs, args))
      }
    }
  } else if (typeof $eval !== 'undefined') {
    //The arguments to the new expression should be part of the invocation object.
    const newArgsRaw = typeof $with === 'object' ? $with : expression
    const newArgs = evalArguments(newArgsRaw, context, args)
    //console.log('Resolving arguments   ', args)
    //console.log('Resolved arguments to ', newArgs)

    if(typeof $eval ==='object') {
      return evalExpression($eval, context, newArgs)
    } else if (typeof $eval === 'function'){
      return $eval.apply(context, [context, newArgs, (expression, newContext, args) => evalExpression(expression, newContext || context, args)])
    }
  } else {
    return expression
  }
}

const evalArguments = (expression, context, args) => {
  const copy = Object.assign({}, expression)
  delete copy.$eval
  delete copy.$from
  delete copy.$curry
  delete copy.$if
  Object.keys(copy).forEach((key) => {
    copy[key] = evalExpression(copy[key], context, args)
  })
  return copy
}

const evalExpression = (expression, context, args) =>  {
  //logExecution(expression, context, args)
  const result = Array.isArray(expression)      ? evalArray(expression, context, args) 
  : typeof expression === 'object' ? evalObjectExpression(expression, context, args)
  :                                  expression

  //console.log('Result', result)
  if (result === undefined) {
  
    console.log('Could not eval', expression)
  }
  return result
}

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
