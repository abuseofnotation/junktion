const test = require('./quicksort')


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
//Store parent-child relations which allows you to provide lexical scope.
const backReferences = new WeakMap()

//Add a reference to a parent scope.
const addBackReference = (obj, parent) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object') {
      addBackReference(obj[key], obj)
    }
  })
  backReferences.set(obj, parent)
}
//Obtain a reference to a a function
const findInScope = (expression, name) => 
  typeof expression[name] !== 'undefined'      ? expression[name] 
   :typeof backReferences.get(expression) !== 'undefined' ? findInScope(backReferences.get(expression), name)
   :undefined
  //TODO  create a real standard lib
  const standardLib = {standard: true}

const eval = (expression) => {
  //Build lexical scope and execute expression with no arguments and context
  addBackReference(expression, standardLib)
  return evalExpression(expression, {}, {})
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

const isExpression = (value) => 
  typeof value === 'string' 
  || (typeof value === 'object' && (value.$eval !== undefined || value.$return !== undefined))

const evalExpression = (expression, context, args, scope) => {
  //logExecution(expression, context, args)
  console.log('------')
  console.log('expression', expression)
  console.log('context', context)
  console.log('args',args)
  console.log('scope', scope)
  //resolve an expression
  const resolve = ($eval) =>
  findInEnvironments([context, args], $eval) 
      || findInScope(scope || expression, $eval) 
      || cannotFindFunction(expression, context, args, $eval)

  if (typeof expression === 'string') {
    return resolve(expression)
  }
  //} else if (typeof expression === 'object') {

  const $from = expression['$from'] 
  const $eval = expression['$eval'] 
  const $return = expression['$return'] 
  if (typeof $return !== 'undefined') {
    return evalExpression($return, expression, {})
  } else if (typeof $eval === 'string') {
    //Search for the function that needs to be invoked.
    //It can either be a method from the environments, or a function that is in the scope
    const newExpression = resolve($eval)
    if (isExpression(newExpression)) {
      //The arguments to the new expression should be part of the invocation object.
      const newArgs = evalArguments(expression, context, args)

      //Change the context if new one is specified, else, leave the old one.
      const newContext = $from !== undefined ? evalExpression($from, context, newArgs) : context
      
      return evalExpression(newExpression, newContext, newArgs)
    } else {
      console.log(`
to 
  ${JSON.stringify(newExpression)}

`)
      return newExpression
    }

  } else if (typeof $eval === 'function'){
    return $eval.apply(context, [context, args])
  } else {
    if (Array.isArray(expression)) {
      return expression.map((expression) => 
          isExpression(expression) ? evalExpression(expression, context, args)
          :                          expression
      ) 
    } else {
      return expression
    }
  }
}
console.log(eval(test))
