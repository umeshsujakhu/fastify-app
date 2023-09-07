"use strict";

const t = require("tap");
const { buildApp } = require("./helper");

t.test("the alive route is online", async (t) => {
  const app = await buildApp(t);
  const response = await app.inject({
    method: "GET",
    url: "/",
  });
  t.same(response.json(), { root: true });
});

t.test("the application should start", async (t) => {
  const app = await buildApp(t, {
    MONGO_URL:
      "mongodb://root:root@localhost:27017/todos-test?authSource=admin",
  });
  await app.ready();
  t.pass("the application is ready");
});

t.test("the application should not start", async (mainTest) => {
  mainTest.test("if there are missing ENV vars", async (t) => {
    try {
      await buildApp(t, {
        NODE_ENV: "test",
        MONGO_URL: undefined,
      });
      t.fail("the server must not start");
    } catch (error) {
      t.ok(error, "error must be set");
      t.match(error.message, "required property 'MONGO_URL'");
    }
  });

  mainTest.test("when mongodb is unreachable", async (t) => {
    try {
      await buildApp(t, {
        NODE_ENV: "test",
        MONGO_URL:
          "mongodb://root:root@localhost:27099/todos-test?authSource=admin",
      });
      t.fail("the server must not start");
    } catch (error) {
      t.ok(error, "error must be set");
      t.match(error.message, "connect ECONNREFUSED");
    }
  });
});
