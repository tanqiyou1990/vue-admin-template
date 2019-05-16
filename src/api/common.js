import request from '@/utils/request'

export function doUpload(data) {
    return request({
      url: '/common/upload',
      method: 'post',
      data,
      contentType:false,
      processData:false,
      headers: { "content-type": "multipart/form-data" }
    })
  }

export function sumCount() {
    return request({
      url: '/block/sumCount',
      method: 'get'
    })
  }