module.exports = {
  $return: {
    token: {$eval: 'head'},
    newList: {$eval: 'tail'},
    firstHalf: { 
      $eval: 'filters', 
      $from: { $eval: 'newList' }, 
      with: {$curry: 'less', than: { $eval: 'token'} } 
    },
    secondHalf: { 
      $eval: 'filters', 
      $from: { $eval: 'newList' }, 
      with: {$curry: 'more', than: { $eval: 'token'} } 
    },

    $if: { $eval:'equals', to:0, $from: {$eval: 'lengths'} },
    $then: { $eval: 'this' },
    $else: {
      $eval: 'flat', 
      $from: [ 
        {$eval: 'quickSort', $from: {$eval: 'firstHalf' } },
        [{$eval: 'token'}],
        {$eval: 'quickSort', $from:  {$eval: 'secondHalf' }}
      ]
    }
  },
}
