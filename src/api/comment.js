import request from '@/utils/request'


export function getComments( data ) {
  return request({
    url: '/comment/getByCid',
    method: 'post',
    data
  })
}

