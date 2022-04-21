/**
 * @desc  [自定义校验规则]
 * @example
 *  import { checkRule } from "@/utils/checkRules";
 *  rules: [
 *     { validator: checkRule.emailValue, trigger: 'blur'}
 *  ]
 */

export const rule = {

  /**
   *必填项校验
   */
  checkNecessary(tipInfo = '请输入', trigger = 'change', isNeces = true, ) {
    return {
      required: isNeces,
      message: tipInfo,
      trigger: trigger
    }
  },
  // 校验最大长度
  checkLen(len = 20) {
    return {
      max: len,
      message: "最大长度为" + len + "个字符",
      trigger: "blur"
    }
  },
  // 校验端口号
  checkPort(rule, value, callback) {
    let reg = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
    if (value && (!(reg).test(value))) {
      callback(new Error('请输入正确的端口号'))
    } else {
      callback()
    }
  },
  checkUrl(rule, value, callback) {
    let reg = /^((https|http|ftp|rtsp|mms):\/\/)(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)$/;
    if (value && (!(reg).test(value))) {
      callback(new Error('请输入正确的URL'))
    } else {
      callback()
    }
  },
  // 校验数字
  checkNumber(rule, value, callback) {
    let reg = /^[0-9]\d*$/
    if (value && (!(reg).test(value))) {
      callback(new Error('请输入数字'))
    } else {
      callback()
    }
  },
  // 校验密码
  checkPassword(rule, value, callback) {
    let reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d].*$/
    if (value && (!(reg).test(value))) {
      callback(new Error('密码至少有一个数字并同时包含大小写字母'))
    } else {
      callback()
    }
  },
  // 校验纬度
  checkLat(rule, value, callback) {
    const reg = /^[\-\+]?((0|([1-8]\d?))(\.\d{1,10})?|90(\.0{1,10})?)$/
    if (value && (!(reg).test(value))) {
      callback(new Error('请输入正确的纬度'))
    } else {
      callback()
    }
  },
  // 校验经度
  checkLng(rule, value, callback) {
    const reg = /^[\-\+]?(0(\.\d{1,10})?|([1-9](\d)?)(\.\d{1,10})?|1[0-7]\d{1}(\.\d{1,10})?|180\.0{1,10})$/
    if (value && (!(reg).test(value))) {
      callback(new Error('输入正确的经度'))
    } else {
      callback()
    }
  },
  // 校验合法IP地址与端口号
  checkHost(rule, value, callback) {
    if (value == '' || value == undefined || value == null) {
      callback()
    } else {
      const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的IP地址'))
      } else {
        callback()
      }
    }
  },
  // 校验合法IP地址
  checkIP(rule, value, callback) {
    if (value == '' || value == undefined || value == null) {
      callback()
    } else {
      const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
      if ((!reg.test(value)) && value != '') {
        callback(new Error('请输入正确的IP地址'))
      } else {
        callback()
      }
    }
  },
  /**
   * 校验 请输入中文、英文、数字包括下划线
   * 名称校验
   */
  validatorNameCn(rule, value, callback) {
    let reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
    if (value && (!(reg).test(value))) {
      callback(new Error('请输入中文、英文、数字、下划线'))
    } else {
      callback()
    }
  },
  // 校验华为描述规则
  validatorDesc(rule, value, callback) {
    let reg = /^(?!\d+$)[^\~\#\$\%\&\*\<\>\(\)\[\]\{\}\'\"\\]*?$/
    if (value && (!(reg).test(value))) {
      callback(new Error('不允许存在特殊字符'))
    } else {
      callback()
    }
  },
  /**
   * 校验 请输入中文、英文、数字包括下划线
   * 名称校验
   */
  validatorKey(rule, value, callback) {
    let reg = /^[A-Z_.]+$/
    if (value && (!(reg).test(value))) {
      callback(new Error('请输入大写英文、下划线'))
    } else {
      callback()
    }
  },

  /**
   * 校验首尾空白字符的正则表达式
   *
   */
  checkSpace(rule, value, callback) {
    let reg = /[^\s]+$/
    if (!reg.test(value)) {
      callback(new Error('请输入非空格信息'))
    } else {
      callback()
    }
  },
  /**
   * 校验手机号
   *
   */
  checkPhone(rule, value, callback) {
    if (!value) {
      return callback(new Error('手机号不能为空'))
    } else {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (reg.test(value)) {
        callback()
      } else {
        return callback(new Error('请输入正确的手机号'))
      }
    }
  },
  /**
   * 校验邮箱
   *
   */
  checkEmail(rule, value, callback) {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (!value) {
      return callback(new Error('邮箱不能为空'))
    }
    setTimeout(() => {
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱格式'))
      }
    }, 100)
  }
}
