const Service = require("@vue/cli-service/lib/Service");
const { semver, error } = require("@vue/cli-shared-utils");
const requiredVersion = require("@vue/cli-service/package.json").engines.node;

const serviceRun = async (rawArgv, context) => {
  if (
    !semver.satisfies(process.version, requiredVersion, {
      includePrerelease: true
    })
  ) {
    const errMsg =
      `当前 Node ${process.version} ——  vue-cli-service ` +
      `限制 Node 使用版本为 ${requiredVersion}.\n 请进行更新.`;
    process.send(errMsg);
    error(errMsg);
    process.exit(1);
  }
  const service = new Service(context);
  const args = require("minimist")(rawArgv, {
    boolean: [
      // build
      "modern",
      "report",
      "report-json",
      "inline-vue",
      "watch",
      // serve
      "open",
      "copy",
      "https",
      // inspect
      "verbose"
    ]
  });

  const command = args._[0];

  const res = await service.run(command, args, rawArgv);
  return res;
};

process.on("message", ({ action, context, rawArgv }) => {
  const actionMap = new Map()
    .set("serve", async () => {
      // 1. 启动本地服务
      serviceRun(rawArgv, context).then(res => {
        const { pid } = process;
        const { url } = res;
        console.log(context, "process.pid", pid); // 子进程id
        const resMsg = {
          action,
          rawArgv,
          context,
          res: {
            pid,
            url
          }
        };
        process.send(resMsg);
      });
    })
    .set("build", async () => {
      // 1.启动打包
      serviceRun(rawArgv, context).then(res => {
        console.log("build-end: ", res);
        process.send({
          action,
          rawArgv,
          context,
          res: res === undefined ? "success" : res
        });
      });
    })
    .set("exit", () => {
      process.send("exit app");
      process.exit(1);
    });
  const func = actionMap.get(action);
  func && func();
});

module.exports = serviceRun;
