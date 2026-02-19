module.exports = {
  hooks: {
    readPackage(pkg) {
      // Allow pnpm to skip build scripts for these packages that don't need compilation
      if (pkg.name === 'sharp' || pkg.name === 'unrs-resolver') {
        delete pkg.scripts?.['build']
        delete pkg.scripts?.['install']
      }
      return pkg
    },
  },
}
