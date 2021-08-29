/**
 * 工具类
 */
import md5 from "js-md5";
import store from "../store";

export default {
  //加密
  permPicEncryptMd5(word) {
    return md5(store.state.wallet.walletPrivateKey + word).toString();
  },
};
