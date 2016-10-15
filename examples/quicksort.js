module.exports = {
  lengths: {
    $eval: (context, args) => context.length
  },
  fold: {
    $eval:(context, args) => {
      return context.reduce(args.f, args.acc)
    }
  },
  filters: {
    $eval: (env, args, eval) => {
      return env.filter((val)=> eval(args.with, val))
    }
  },
  flat: {
    f:(acc, element) => acc.concat(element) , 
    acc: [],
    $eval: 'fold',
  },
  $return: {
    token: { $eval: (env)=> env[0] },
    newList: { $eval: (env) => {return env.slice(1)} },
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
