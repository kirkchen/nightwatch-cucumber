var objectAssign = require('object-assign')
var assert = require('assert')
var peerTest = require('./peer-test')
var closeSessionOptions = ['afterScenario', 'afterFeature', 'never']

module.exports = function (providedOptions) {
  if (this.World) return // Cucumber is running this file twice. We need only the first run

  var ok = 0

  var notTested = function (supportedVersions, packageName, version) {
    console.log(packageName + ' ' + version + ' is not tested with nightwatch-cucumber. You may notice some issues. Please contact the package maintainer to add support for this version. Supported version are ' + supportedVersions)
    ok++
  }

  var supported = function (packageName, version) {
    ok++
  }
  var notSuppoted = function (supportedVersions, packageName, version) {
    console.error(packageName + ' ' + version + ' is not suppoted by nightwatch-cucumber. Please contact the package maintainer to add support for this version. Supported version are ' + supportedVersions)
  }
  var notFound = function (packageName) {
    console.error(packageName + ' was not found. It is needed by nightwatch-cucumber :( Try to install it with "npm install ' + packageName + '"')
  }

  peerTest('nightwatch', {
    '^0.9.2': notTested.bind(null, '0.8.0 - 0.9.1'),
    '0.8.0 - 0.9.1': supported,
    other: notSuppoted.bind(null, '0.8.0 - 0.9.1'),
    notFound: notFound
  })
  peerTest('cucumber', {
    '^1.0.1': notTested.bind(null, '1.0.0 - 1.0.0'),
    '1.0.0 - 1.0.0': supported,
    other: notSuppoted.bind(null, '1.0.0 - 1.0.0'),
    notFound: notFound
  })

  if (ok < 2) return console.log('\n\n\n')

  var options = objectAssign({
    runner: 'nightwatch',
    featureFiles: 'features',
    stepDefinitions: 'features/step_definitions',
    closeSession: 'afterFeature',
    htmlReport: 'reports/index.html'
  }, providedOptions)

  assert(closeSessionOptions.indexOf(options.closeSession) !== -1, 'Bad configuration for nightwatch-cucumber. closeSession should be ' + closeSessionOptions.join(' or '))

  if (options.runner === 'cucumber') {
    return require('./cucumber-runner')(options)
  }

  return require('./nightwatch-runner')(options)
}
