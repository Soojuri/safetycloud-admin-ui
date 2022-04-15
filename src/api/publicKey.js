import request from '@/router/axios'

// 获取公钥
export function getPublicKey() {
  return request({
    url: '/admin/user/publicKey',
    method: 'get'
  })
}
