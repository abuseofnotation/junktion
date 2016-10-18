const parent = Symbol.for('parent')

const whileNotUndefined = (functions, args) => {
  for (var i = 0; i < functions.length; i++) {
    var result = functions[i].apply(null, args)
    if (result !== undefined){
      return result
    }
  }
}
const checkIfContext = (expression, context, args, name) =>  name === 'this' ? context : undefined

const findInEnvironments = (expression, context, args, name) => {
  const environments = [context, args]
  return environments.reduce((acc, environment) => acc !== undefined ? acc : environment[name] , undefined)
}

//Obtain a reference to a function
const findInScope = (expression, context, args, name) => {
  return typeof expression[name] !== 'undefined'      ? expression[name] 
   :typeof expression[parent] !== 'undefined' ? findInScope(expression[parent], context, args, name)
   :undefined
}

const cannotFindFunction = (expression, context, args, name) => {throw `
Could not find '${name}'.

It was not part of the context like ${Object.keys(context).join(', ')}
       Nor it was an argument, like ${Object.keys(args).join(', ')}
Also it wasn't part of the scope.`

}
module.exports = (expression, context, args) => (name) =>
  whileNotUndefined([checkIfContext, findInEnvironments, findInScope, cannotFindFunction]
      , [expression, context, args, name])
