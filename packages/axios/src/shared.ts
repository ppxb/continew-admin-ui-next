import type { AxiosHeaderValue, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

/**
 * 获取请求的 Content-Type 值
 * @param config Axios 请求配置
 * @returns Content-Type 值，默认为 'application/json'
 */
export function getContentType(config: InternalAxiosRequestConfig): AxiosHeaderValue {
  return config.headers?.['Content-Type'] || 'application/json'
}

/**
 * 判断 HTTP 状态码是否表示成功
 * @param status HTTP 状态码
 * @returns 如果状态码在 200-299 范围内或等于 304，则返回 true
 */
export function isHttpSuccess(status: number) {
  const isSuccessCode = status >= 200 && status < 300
  const isNotModified = status === 304
  return isSuccessCode || isNotModified
}

/**
 * 判断响应是否为 JSON 类型
 * @param response Axios 响应对象
 * @returns 如果响应类型为 'json' 或未定义，则返回 true
 */
export function isResponseJson(response: AxiosResponse) {
  const { responseType } = response.config
  return responseType === 'json' || responseType === undefined
}
