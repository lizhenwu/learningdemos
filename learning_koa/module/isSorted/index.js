function defaultCompartor (a, b) {
  return a - b
}
module.exports = function (arr, compartor) {
  compartor = compartor || defaultCompartor
  for (let i = 1; i < arr.length; i++) {
    if (compartor(arr[i - 1], arr[i]) > 0) {
      return false
    }
  }
  return true
}
