import request from '../utils/request'

export function createForm(data) {
  return request({
    url: '/form',
    method: 'post',
    data
  })
}

export function getForm(id) {
  return request({
    url: `/form/${id}`,
    method: 'get'
  })
}

export function getFormByCode(code) {
  return request({
    url: `/form/code/${code}`,
    method: 'get'
  })
}

export function listForms(params) {
  return request({
    url: '/form',
    method: 'get',
    params
  })
}

export function updateForm(id, data) {
  return request({
    url: `/form/${id}`,
    method: 'put',
    data
  })
}

export function deleteForm(id) {
  return request({
    url: `/form/${id}`,
    method: 'delete'
  })
}

export function saveVersion(data) {
  return request({
    url: '/form/version',
    method: 'post',
    data
  })
}

export function listVersions(formId) {
  return request({
    url: `/form/${formId}/versions`,
    method: 'get'
  })
}

export function getFormByVersion(formId, version) {
  return request({
    url: `/form/${formId}/version/${version}`,
    method: 'get'
  })
}

export function saveFormData(data) {
  return request({
    url: '/form/data',
    method: 'post',
    data
  })
}

export function getFormData(id) {
  return request({
    url: `/form/data/${id}`,
    method: 'get'
  })
}

export function listFormData(formId, params) {
  return request({
    url: `/form/data/list/${formId}`,
    method: 'get',
    params
  })
}

export function updateFormData(id, data) {
  return request({
    url: `/form/data/${id}`,
    method: 'put',
    data
  })
}

export function deleteFormData(id) {
  return request({
    url: `/form/data/${id}`,
    method: 'delete'
  })
}

export function generateCrudApi(formId) {
  return request({
    url: `/form/${formId}/crud-api`,
    method: 'get'
  })
}