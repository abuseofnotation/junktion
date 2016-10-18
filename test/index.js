const junk = require('../src/interpreter')
const quickSort = require('../examples/quicksort')
if ( global.v8debug ) {
	global.v8debug.Debug.setBreakOnException(); // speaks for itself
}
/*
exports.quickSort = (test) => {
  test.deepEqual(
    junk({
      quickSort: quickSort,
      $return: { $eval: 'quickSort', $from: [3, 5, 4, 2, 1, 6] }
    })
    , [1, 2, 3, 4, 5, 6])

  test.deepEqual(
    junk({
      quickSort: quickSort,
      $return: { $eval: 'quickSort', $from: [1, 3, 2, 6, 5, 4] }
    })
  , [1, 2, 3, 4, 5, 6])
  test.done()
}
*/


exports.basic = (test) => {
  test.deepEqual(junk({$eval: 'flat', $from:[[1],[2],[3]]}), {value: [1,2,3]})
  test.done()
}

exports.basic2 = (test) => {
  test.deepEqual(junk({$eval: 'flat', $from:[
    [{$eval:'less', than: 1, from: 2} ]
  
  ]}), {value: [false]})
  test.done()
}

exports.recursion = (test) => {
  test.deepEqual(junk({
    recur: {
      $if: {equal: { $eval:'length'}, to: 0},
      $then: 'this', 
      $else: {
        $eval: 'flat',
        $from: [
          [{$eval: 'head'}],
          {$eval: 'recur', $from: {$eval: 'tail'}}
        ]
      }
    },
    $return:{$eval:'recur' , $from:[1, 2, 3]}
  }).value, [1,2,3])
  test.done()
}
/*
exports.higherOrderFunctions = (test) => {
  test.deepEqual(junk({
    $eval: 'filters',
    $from: [1, 2, 3, 4, 5, 6],
    with: {
      $curry: 'less',
      than: 4
    }
  }).value, [1,2,3])
  test.done()
}
*/
exports.eval = (test) => {
  test.deepEqual(junk({
    $eval: 'less',
    than: 1,
    $from: -1,
      
  }), true)
  test.done()
}
exports.evalExplicit = (test) => {
  test.deepEqual(junk({
    $eval: 'less',
    $with:{than: 1},
    $from: -1,
  }), true)
  test.done()
}
/*
exports.curry = (test) => {
  test.deepEqual(junk({
    $eval: {
      $curry: 'less',
      than: 1
    }, 
    $from: -1
      
  }), true)
  test.done()
}
*/
