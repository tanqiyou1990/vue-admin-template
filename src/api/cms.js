import request from '@/utils/request'

///////////-About

export function newAboutRelease(data) {
  return request({
    url: '/admin/cms/about/new',
    method: 'post',
    data
  })
}

export function updateAboutRelease(data) {
  return request({
    url: '/admin/cms/about/update',
    method: 'post',
    data
  })
}

export function releaseAboutList() {
  return request({
    url: '/admin/cms/about/releaseList',
    method: 'get'
  })
}

export function loadAboutByRelease(releaseNum) {
  return request({
    url: '/admin/cms/about/loadByRelease',
    method: 'get',
    params: { releaseNum }
  })
}

///////////-Footer

export function newFooterRelease(data) {
  return request({
    url: '/admin/cms/footer/new',
    method: 'post',
    data
  })
}

export function updateFooterRelease(data) {
  return request({
    url: '/admin/cms/footer/update',
    method: 'post',
    data
  })
}

export function releaseFooterList() {
  return request({
    url: '/admin/cms/footer/releaseList',
    method: 'get'
  })
}

export function loadFooterByRelease(releaseNum) {
  return request({
    url: '/admin/cms/footer/loadByRelease',
    method: 'get',
    params: { releaseNum }
  })
}

///////////-Home

export function newHomeRelease(data,moduleNum) {
  return request({
    url: `/admin/cms/home${moduleNum}/new`,
    method: 'post',
    data
  })
}

export function updateHomeRelease(data,moduleNum) {
  return request({
    url: `/admin/cms/home${moduleNum}/update`,
    method: 'post',
    data
  })
}

export function releaseHomeList(moduleNum) {
  return request({
    url: `/admin/cms/home${moduleNum}/releaseList`,
    method: 'get'
  })
}

export function loadHomeByRelease(releaseNum,moduleNum) {
  return request({
    url: `/admin/cms/home${moduleNum}/loadByRelease`,
    method: 'get',
    params: { releaseNum }
  })
}
