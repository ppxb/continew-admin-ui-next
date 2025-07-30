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

// TODO: REQUEST INSTANCE AND DATA DECLARATION
