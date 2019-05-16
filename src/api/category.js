import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/category/page',
    method: 'get',
    params
  })
}

export function addCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

export function getCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'get'
  })
}

export function editCategory(data) {
  return request({
    url: '/category',
    method: 'put',
    data
  })
}

export function deleteCategory(id) {
  return request({
    url: '/category/' + id,
    method: 'delete'
  })
}

export function getCategoryOptions(params) {
  return request({
    url: '/category/options',
    method: 'get',
    params: params
  })
}
