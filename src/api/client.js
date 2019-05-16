import request from '@/utils/request'

export function addClient(data) {
  return request({
    url: '/serverToken',
    method: 'post',
    data
  })
}

export function updateClient(data) {
  return request({
    url: '/serverToken',
    method: 'put',
    data
  })
}

export function publish(params) {
  return request({
    url: '/admin/news/publish',
    method: 'get',
    params
  })
}

export function deleteClient(id) {
  return request({
    url: '/serverToken/' + id,
    method: 'delete'
  })
}

export function getList(params) {
  return request({
    url: '/serverToken/page',
    method: 'get',
    params
  })
}

export function getClient(id) {
  return request({
    url: '/serverToken/' + id,
    method: 'get'
  })
}
