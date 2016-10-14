module.exports = {
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
    f: { $eval: (env, args) => (val) => args.value < val }
  },
  moreThan: { 
    $eval: 'filters', 
    f: { $eval: (env, args) => (val) => args.value > val } 
  },
  quickSort: {
    token: { $eval: (env)=> env[0] },
    newList: { $eval: (env) => {return env.slice(1)} },
    $eval: 'flat', 
    $from: [ 
      { $eval: 'lessThan', $from: { $eval: 'newList' }, value: { $eval: 'token'} },
      [{$eval: 'token'}],
      { $eval: 'moreThan', $from: {$eval: 'newList' }, value: { $eval: 'token'} }
    ]
  },
  $return: { $eval: 'quickSort', $from: [3, 2, 3, 4, 6, 12] }
}
