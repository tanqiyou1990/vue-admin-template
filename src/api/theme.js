import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/theme/page',
    method: 'get',
    params: params
  })
}

export function getThemeCategory(){
  return request({
    url: '/theme/getThemeCategory',
    method: 'get'
  })
}

export function addTheme(data) {
  return request({
    url: '/theme',
    method: 'post',
    data
  })
}

export function getTheme(id) {
  return request({
    url: '/theme/' + id,
    method: 'get'
  })
}

export function editTheme(data) {
  return request({
    url: '/theme',
    method: 'put',
    data
  })
}

export function deleteTheme(id) {
  return request({
    url: '/theme/' + id,
    method: 'delete'
  })
}

export function getThemeOptions(params) {
  return request({
    url: '/theme/options',
    method: 'get',
    params: params
  })
}
