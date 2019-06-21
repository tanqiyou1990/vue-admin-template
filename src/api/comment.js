import request from '@/utils/request'


export function getComments( data ) {
  return request({
    url: '/comment/page',
    method: 'get',
    data
  })
}

