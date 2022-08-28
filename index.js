const core = require('@actions/core');
const setup = require('./setup-consul-template');


async function run() {
  try {
    await setup();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
