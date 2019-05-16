import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/content/page',
    method: 'get',
    params
  })
}

export function addContent(data) {
  return request({
    url: '/content',
    method: 'post',
    data
  })
}

export function getContent(id) {
  return request({
    url: '/content/' + id,
    method: 'get'
  })
}

export function editContent(data) {
  return request({
    url: '/content',
    method: 'put',
    data
  })
}

export function deleteContent(id) {
  return request({
    url: '/content/' + id,
    method: 'delete'
  })
}

export function publishContent(id) {
  return request({
    url: '/content/publish/' + id,
    method: 'get'
  })
}

export function getContentOptions(params) {
  return request({
    url: '/content/options',
    method: 'get',
    params: params
  })
}
