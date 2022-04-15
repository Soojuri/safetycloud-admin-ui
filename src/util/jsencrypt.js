import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAL9NlgGduIQaKkPeKM5r7kw7Ch/+iMFI\n' +
  'RAZUAPixTsiBkYaQnMp1xa2x834VW3x38zKOe88nR+wovBGc2DIS/oMCAwEAAQ=='

const privateKey = 'MIIBVQIBADANBgkqhkiG9w0BAQEFAASCAT8wggE7AgEAAkEAv02WAZ24hBoqQ94o\n' +
  'zmvuTDsKH/6IwUhEBlQA+LFOyIGRhpCcynXFrbHzfhVbfHfzMo57zydH7Ci8EZzY\n' +
  'MhL+gwIDAQABAkAd5v6/meuxmnVozl0KhwxklgXrIlo1/BnF83ODbBOoe3MJqh+0\n' +
  'Mn4bDirrRh2sONsr/eGyEJOfrZbq1HQ8kC9hAiEA5rAi//L//pF/jhMhxSV9MUh3\n' +
  'MRLJ5m1wWYWTdW4AiKUCIQDUSydOUHU4bVu7DFzSjstkIT48CvotaLLSfihlo6ya\n' +
  'BwIhAMyVfqSw09jnHlFYpEVb5vgzBQmvWQETI2UxMkIdaTnFAiEAzKBMGL6Q3nz6\n' +
  'iEcYSZR+E9u/IxzpnE9o3l/gDGhBfI0CID5vXgy6xbnagdKwC838MooFMHQOjEDP\n' +
  'khQbpyOcJHWN'

// 加密
export function encrypt (txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

// 解密
export function decrypt (txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey) // 设置私钥
  return encryptor.decrypt(txt) // 对数据进行解密
}

//服务端公钥加密
export function serveEncrypt (txt, key) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(key) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}
