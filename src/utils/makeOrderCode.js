function makeOrderCode(prefix = 'ORD') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
}
module.exports = makeOrderCode;
