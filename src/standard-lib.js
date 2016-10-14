module.exports = {
  equals: {
    $eval: (context, args) => context === args.to
  }
}
