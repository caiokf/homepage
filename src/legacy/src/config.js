const config = () => {
  const env = {
    production: {
      featureToggles: {},
    },
    development: {
      featureToggles: {},
    },
  }
  return process.env.ENVIRONMENT ? env[process.env.ENVIRONMENT] : env
}
module.exports = config
