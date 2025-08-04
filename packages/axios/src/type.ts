import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export type ContentType = 'text/html'
  | 'text/plain'
  | 'multipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream'

export interface RequestOption<ResponseData = any> {
  isBackendSuccess: (response: AxiosResponse<ResponseData>) => boolean
  transformBackendResponse: (response: AxiosResponse<ResponseData>) => any | Promise<any>
  onRequest: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  onBackendFail: (response: AxiosResponse<ResponseData>, instance: AxiosInstance) => Promise<AxiosResponse | null> | Promise<void>
  onError: (error: AxiosError<ResponseData>) => void | Promise<void>
}

interface ResponseMap {
  blob: Blob
  text: string
  arrayBuffer: ArrayBuffer
  stream: ReadableStream<Uint8Array>
  document: Document
}

export type ResponseType = keyof ResponseMap | 'json'

export type MappedType<R extends ResponseType, JsonType = any> = R extends keyof ResponseMap
  ? ResponseMap[R]
  : JsonType

export type CustomAxiosRequestConfig<R extends ResponseType = 'json'> = Omit<AxiosRequestConfig, 'responseType'> & {
  responseType?: R
}

export interface RequestInstanceCommon<T> {
  cancelRequest: (requestId: string) => void
  cancelAllRequest: () => void
  state: T
}

export interface RequestInstance<S = Record<string, unknown>> extends RequestInstanceCommon<S> {
  <T = any, R extends ResponseType = 'json'>(config: CustomAxiosRequestConfig<R>): Promise<MappedType<R, T>>
}

export type FlatResponseSuccessData<T = any, ResponseData = any> = {
  data: T
  error: null
  response: AxiosResponse<ResponseData>
}

export type FlatResponseFailData<ResponseData = any> = {
  data: null
  error: AxiosError<ResponseData>
  response: AxiosResponse<ResponseData>
}

export type FlatResponseData<T = unknown, ResponseData = unknown> = FlatResponseSuccessData<T, ResponseData> | FlatResponseFailData<ResponseData>

export interface FlatRequestInstance<S = Record<string, unknown>, ResponseData = any> extends RequestInstanceCommon<S> {
  <T = any, R extends ResponseType = 'json'>(config: CustomAxiosRequestConfig<R>): Promise<FlatResponseData<MappedType<R, T>, ResponseData>>
}
