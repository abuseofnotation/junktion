const core = require('folktale/core')
const evalExpression = require('./evaluator')
const preprocess = require('./preprocessor')

const standardLib = require('./standard-lib')

module.exports = (expression) => {
  standardLib.$return = expression
  console.log(preprocess(standardLib))
  return evalExpression(preprocess(standardLib), {}, {})
}
