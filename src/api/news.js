import request from '@/utils/request'

export function addNews(data) {
  return request({
    url: '/admin/news/addNews',
    method: 'post',
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

export function deleteNews(params) {
  return request({
    url: '/admin/news/delete',
    method: 'get',
    params
  })
}

export function getList(data) {
  return request({
    url: '/admin/news/list',
    method: 'post',
    data
  })
}

export function newsDtl(nid) {
  return request({
    url: `/admin/news/newsDtl/${nid}`,
    method: 'get'
  })
}

export function doUpload(data) {
  return request({
    url: '/admin/news/upload',
    method: 'post',
    data,
    contentType:false,
    processData:false,
    headers: { "content-type": "multipart/form-data" }
  })
}
