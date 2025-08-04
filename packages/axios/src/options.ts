import type { CreateAxiosDefaults } from 'axios'
import type { IAxiosRetryConfig } from 'axios-retry'
import { stringify } from 'qs'

import type { RequestOption } from './type'
import { isHttpSuccess } from './shared'

export function createDefaultOptions<ResponseData = any>(options?: Partial<RequestOption<ResponseData>>) {
  const opts = {
    onRequest: async config => config,
    onBackendFail: async () => {},
    onError: async () => {},
    isBackendSuccess: _response => true,
    transformBackendResponse: async response => response.data
  } as RequestOption<ResponseData>

  Object.assign(opts, options)
  return opts
}

export function createRetryOptions(config?: Partial<CreateAxiosDefaults>) {
  const retryConfig = {
    retries: 0
  } as IAxiosRetryConfig

  Object.assign(retryConfig, config)
  return retryConfig
}

export function createAxiosConfig(config?: Partial<CreateAxiosDefaults>) {
  const TEN_SECONDS = 10 * 1000

  const axiosConfig = {
    timeout: TEN_SECONDS,
    headers: {
      'Content-Type': 'application/json'
    },
    validateStatus: isHttpSuccess,
    paramsSerializer: (params) => {
      return stringify(params)
    }
  } as CreateAxiosDefaults

  Object.assign(axiosConfig, config)
  return axiosConfig
}
