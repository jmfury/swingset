function normalizeToUnixPath(str) {
  return str.replace(/\\/g, '/')
}

module.exports = normalizeToUnixPath
