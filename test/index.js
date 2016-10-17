const junk = require('../src/interpreter')
const quickSort = require('../examples/quicksort')
if ( global.v8debug ) {
	global.v8debug.Debug.setBreakOnException(); // speaks for itself
}
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
