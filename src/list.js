module.exports = {
  value: 'value',
  lengths: {
    $eval: (context, args) => context.value.length
  },
  fold: {
    $eval: (context, args) => {
      return context.value.reduce(args.f, args.acc)
    }
  },
  filters: {
    $eval: (env, args, eval) => {
      return env.value.filter((val)=> eval(args.with, val))
    }
  },
  flat: {
    f:(acc, element) => acc.concat(element) , 
    acc: [],
    $eval: 'fold',
  },
}
