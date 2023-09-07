"use strict";

const fcli = require("fastify-cli/helper");
const startArgs = "-l info --options app.js";

const defaultEnv = {
  NODE_ENV: "test",
  MONGO_URL: "mongodb://root:root@localhost:27017/todos-test?authSource=admin",
  JWT_SECRET: "secret123",
};

// Fill in this config with all the configurations
// needed for testing the application
function config(env) {
  return {
    configData: env,
  };
}

// automatically build and tear down our instance
async function buildApp(t, env, serverOptions) {
  const app = await fcli.build(
    startArgs,
    config({ ...defaultEnv, ...env }),
    serverOptions
  );
  t.teardown(() => {
    app.close();
  });
  return app;
}

module.exports = {
  buildApp,
};
