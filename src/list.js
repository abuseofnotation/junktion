
const listProto = {
  value: 'value',
  lengths: {
    $eval: (context, args) => context.value.length
  },
  fold: {
    $eval: (context, args) => {
      return List(context.value.reduce(args.f, args.acc))
    }
  },
  filters: {
    $eval: (env, args, eval) => {
      return List(env.value.filter((val)=> eval(args.with, val)))
    }
  },
  flat: {
    /*
    with:(acc, element) => acc.concat(element) , 
    from: [],
    $eval: 'fold',
    */
    $eval:(env, args, eval) => {
      const result = List(env.value.reduce((acc, val) => acc.concat(val.value), []))
      debugger
      return List(env.value.reduce((acc, val) => acc.concat(val.value), []))
    }
  },
  head: {
    $eval: (env, args, eval) => {
      return List(env.value[0])
    }
  },
  tail: {
    $eval: (env, args, eval) => {
      return List(env.value.slice(1))
    }
  }
}
const List = (value) => {
  const list = Object.create(listProto)
  list.value = value
  return list
}
module.exports = listProto
