module.exports = {
  equals: {
    to:'to',
    $eval: (context, args) => context === args.to
  },
  less: {
    than:'than',
    $eval: (env, args) => env < args.than
  },
  more: {
    than:'than',
    $eval: (env, args) => env > args.than
  },
  List: require('./list.js')
}
