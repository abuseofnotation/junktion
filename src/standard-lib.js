module.exports = {
  equals: {
    $eval: (context, args) => context === args.to
  },
  less: {
    $eval: (env, args) => env < args.than
  },
  more: {
    $eval: (env, args) => env > args.than
  }
}
