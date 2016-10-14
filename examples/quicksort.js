module.exports = {
  lengths: {
    $eval: (context, args) => context.length
  },
  fold: {
    //$eval: (env) => env.reduce(env.acc, env.f)
    $eval:(context, args) => {
      return context.reduce(args.f, args.acc)
    }
  },
  filters: {
    $eval: (env, args) => env.filter(args.f)
  },
  flat: {
    f:(acc, element) => acc.concat(element) , 
    acc: [],
    $eval: 'fold',
  },
  lessThan: { 
    $eval: 'filters', 
    f: { $eval: (env, args) => (val) => args.value > val }
  },
  moreThan: { 
    $eval: 'filters', 
    f: { $eval: (env, args) => (val) => args.value < val } 
  },
  less: {
  },
  more: {
  },
  $return: {
    token: { $eval: (env)=> env[0] },
    newList: { $eval: (env) => {return env.slice(1)} },
    firstHalf: { $eval: 'lessThan', $from: { $eval: 'newList' }, value: { $eval: 'token'} },
    secondHalf: { $eval: 'moreThan', $from: { $eval: 'newList' }, value: { $eval: 'token'} },

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
