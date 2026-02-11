module.exports = {
  hooks: {
    readPackage(pkg) {
      // Allow build scripts for packages that need native compilation
      if (pkg.name === 'sharp' || pkg.name === 'unrs-resolver') {
        pkg.scripts = pkg.scripts || {}
      }
      return pkg
    },
  },
}
