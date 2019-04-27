import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/sysUser/login',
    method: 'post',
    data
  })
}

export function getInfo(userId) {
  return request({
    url: '/admin/sysUser/info',
    method: 'get',
    params: { userId }
  })
}

export function logout(userId) {
  return request({
    url: '/admin/sysUser/logout',
    method: 'get',
    params: { userId }
  })
}
