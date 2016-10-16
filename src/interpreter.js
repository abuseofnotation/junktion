const findInEnvironments = (environments, name) => 
  environments.reduce((acc, environment) => acc !== undefined ? acc : environment[name] , undefined)


const cannotFindFunction = (expression, context, args, eval) => {throw `
Could not find '${eval}'.

It was not part of the context like ${Object.keys(context).join(', ')}
       Nor it was an argument, like ${Object.keys(args).join(', ')}
Also it wasn't part of the scope.`

}

const logExecution = (expression, context, args) => {
  console.log(`Executing ${JSON.stringify(expression)}
  with context
    ${JSON.stringify(context)}
  with arguments
    ${JSON.stringify(args)}
    `)
}

const checkIfContext = (context, expression) =>  expression === 'this' ? context : undefined


const parent = Symbol.for('parent')

//Add a reference to a parent scope.
const addBackReference = (obj, parentScope) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      addBackReference(obj[key], obj)
    }
  })
  Object.defineProperty(obj, parent, {configurable: true, ennumerable: false, value: parentScope})
}

//Obtain a reference to a function
const findInScope = (expression, name) => 
  typeof expression[name] !== 'undefined'      ? expression[name] 
   :typeof expression[parent] !== 'undefined' ? findInScope(expression[parent], name)
   :undefined

  const standardLib = require('./standard-lib')

const resolveAll = (expression, context, args) => {
  var changed = false
  const resolve = ($eval) =>
  checkIfContext(context, $eval) 
      || findInEnvironments([context, args], $eval) 
      || findInScope(expression, $eval) 
      || cannotFindFunction(expression, context, args, $eval)

  const newExpression = Object.keys(expression).reduce((newExpression, key) => {
    if(typeof expression[key] === 'string') {
      newExpression[key] = resolve(expression[key])
      changed = true
    } else {
      newExpression[key] = expression[key]
    }
    return newExpression
  }, {})

  if (changed) {
    Object.defineProperty(newExpression, parent, 
        {configurable: true, ennumerable: false, value: expression[parent]})
    return newExpression
  } else {
    return expression
  }
}

const evalExpression = (expressionRaw, context, args, scope) => {
  //logExecution(expression, context, args)
  console.log('------')
  console.log('expression', expression)
  console.log('context', context)
  console.log('args',args)
  console.log('scope', scope)

  const expression = resolveAll(expressionRaw, context, args)

  const $if = expression['$if'] 
  const $then = expression['$then'] 
  const $else = expression['$else'] 

  const $from = expression['$from'] 
  const $eval = expression['$eval'] 
  const $curry = expression['$curry'] 

  const $return = expression['$return'] 

  if (typeof $if !== 'undefined') {
    return evalExpression($if, context, args) ? evalExpression($then, context, args)
          :                                     evalExpression($else, context, args)
  } else if (typeof $return !== 'undefined') {
    return evalExpression($return, context, args)
  } else if (typeof $curry === 'object') {
    const curriedExpression = $curry
    const curriedArgs = evalArguments(expression, context, args)
    return {$eval: (env, args) => evalExpression(curriedExpression, env, Object.assign({}, curriedArgs, args))}
  } else if (typeof $eval === 'object') {
    //Search for the function that needs to be invoked.
    //It can either be a method from the environments, or a function that is in the scope
    const newExpression = $eval
    //The arguments to the new expression should be part of the invocation object.
    const newArgs = evalArguments(expression, context, args)

    //Change the context if new one is specified, else, leave the old one.
    const newContext = $from !== undefined ? evalExpression($from, context, newArgs) : context
    
    return evalExpression(newExpression, newContext, newArgs)

  } else if (typeof $eval === 'function'){
    return $eval.apply(context, [context, args, (expression, newContext, args) => evalExpression(expression, newContext || context, args)])
  } else {
    if (Array.isArray(expression)) {
      return expression.map((expression) => evalExpression(expression, context, args)) 
    } else {
      return expression
    }
  }
}

const evalArguments = (expression, context, args) => {
  const copy = Object.assign({}, expression)
  delete copy.$eval
  delete copy.$from
  Object.keys(copy).forEach((key) => {
    copy[key] = evalExpression(copy[key], context, args, expression)
  })
  return copy
}

module.exports = (expression) => {
  //Build lexical scope and execute expression with no arguments and context
  addBackReference(expression, standardLib)

  return evalExpression(expression, {}, {})
}
