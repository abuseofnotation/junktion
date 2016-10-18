const listProto = {
  value: 'value',
  lengths: {
    $eval: (context, args) => context.value.length,
    length: true
  },
  filters: {
    $eval: (context, args, eval) => {
      return List(context.value.filter((val)=> {
        debugger
        return eval(args.with, val)
      }))
    },
    filter:true,
    with:'with'
  },
  flat: {
    /*
    with:(acc, element) => acc.concat(element) , 
    from: [],
    $eval: 'fold',
    */
    $eval:(env, args, eval) => {
      const result = List(env.value.reduce((acc, val) => acc.concat(val.value), []))
      return List(env.value.reduce((acc, val) => acc.concat(val.value), []))
    },
    flat: true
  },
  head: {
    $eval: (env, args, eval) => {
      return env.value[0]
    },
    head: true
  },
  tail: {
    $eval: (env, args, eval) => {
      return List(env.value.slice(1))
    },
    tail: true
  }
}
const List = (value) => {
  const list = Object.create(listProto)
  list.value = value
  return list
}
module.exports = listProto
