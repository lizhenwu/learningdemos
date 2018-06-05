const sorted = require('../')
const tape = require('tape')
const data = require('./data')

const comparators = {
  descending: function (a, b) { return b - a }
}
data.forEach(function (f) {
  tape(`return ${f.expected} for ${f.array}`, function (t) {
    t.plan(1)

    const actual = sorted(f.array, comparators[f.comparator])
    t.equal(actual, f.expected)
  })
}, this)
