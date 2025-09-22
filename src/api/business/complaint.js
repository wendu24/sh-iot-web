import request from '@/utils/request'


export function search(data) {
  return request({
    url: '/complaint/search',
    method: 'post',
    data: data
  })
}