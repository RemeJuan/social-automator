function ranDom(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

function ranTag(tags) {
  const index = Math.floor(Math.random() * tags.length);
  return index;
}

module.exports = {
  ranDom,
  ranTag,
};
