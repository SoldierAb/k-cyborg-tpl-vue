import antZhCN from "ant-design-vue/lib/locale/zh_CN";
const defaultAppConfig = require("../../__entrys__/tpl/config.json");

export default {
  inject: {
    localeData: {
      default() {
        return {
          antLocale: antZhCN
        };
      }
    },
    // AppConfig: {
    //   default() {
    //     return defaultAppConfig;
    //   }
    // },
    originAppConfig: {
      default() {
        return defaultAppConfig;
      }
    },
    reactiveData: {
      default() {
        return {
          default: "default inject"
        };
      }
    }
  }
};
