const junk = require('../src/interpreter')
const quickSort = require('../examples/quicksort')

exports.quickSort = (test) => {
  test.deepEqual(
    junk({
      quickSort: quickSort,
      $return: { $eval: 'quickSort', $from: [3, 5, 4, 2, 1, 6] }
    })
  , [1, 2, 3, 4, 5, 6])
  test.done()

}
