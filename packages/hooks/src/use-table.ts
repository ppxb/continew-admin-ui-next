import { computed, reactive, ref } from 'vue'
import type { Ref, VNodeChild } from 'vue'
import useLoading from './use-loading'
import useBoolean from './use-boolean'
import { jsonClone } from '../../utils/src'

export type MaybePromise<T> = T | Promise<T>

export type ApiFn = (args: any) => Promise<unknown>

export type TableColumnCheckTitle = string | ((...args: any) => VNodeChild)

export type TableColumnCheck = {
  key: string
  title: TableColumnCheckTitle
  checked: boolean
}

export type TableDataWithIndex<T> = T & { index: number }

export type TransformData<T> = {
  data: TableDataWithIndex<T>[]
  pageNum: number
  pageSize: number
  total: number
}

export type Transformer<T, Response> = (response: Response) => TransformData<T>

export type TableConfig<A extends ApiFn, T, C> = {
  apiFn: A
  apiParams?: Parameters<A>[0]
  transformer: Transformer<T, Awaited<ReturnType<A>>>
  columns: () => C[]
  getColumnChecks: (columns: C[]) => TableColumnCheck[]
  getColumns: (columns: C[], checks: TableColumnCheck[]) => C[]
  onFetched?: (transformed: TransformData<T>) => MaybePromise<void>
  immediate?: boolean
}

export default function useHookTable<A extends ApiFn, T, C>(config: TableConfig<A, T, C>) {
  const { loading, startLoading, endLoading } = useLoading()
  const { bool: empty, setBool: setEmpty } = useBoolean()
  const { apiFn, apiParams, transformer, immediate = true, getColumnChecks, getColumns } = config

  const searchParams: NonNullable<Parameters<A>[0]> = reactive(jsonClone({ ...apiParams }))

  const allColumns = ref(config.columns()) as Ref<C[]>

  const data: Ref<TableDataWithIndex<T>[]> = ref([])

  const columnChecks: Ref<TableColumnCheck[]> = ref(getColumnChecks(config.columns()))

  const columns = computed(() => getColumns(allColumns.value, columnChecks.value))

  function reloadColumns() {
    allColumns.value = config.columns()

    const checkMap = new Map(columnChecks.value.map(col => [col.key, col.checked]))

    const defaultChecks = getColumnChecks(allColumns.value)

    columnChecks.value = defaultChecks.map(col => ({
      ...col,
      checked: checkMap.get(col.key) ?? col.checked
    }))
  }

  async function getData() {
    startLoading()

    const formattedParams = formatSearchParams(searchParams)

    const response = await apiFn(formattedParams)

    const transformed = transformer(response as Awaited<ReturnType<A>>)

    data.value = transformed.data

    setEmpty(transformed.data.length === 0)

    await config.onFetched?.(transformed)

    endLoading()
  }

  function formatSearchParams(params: Record<string, unknown>) {
    const formattedParams: Record<string, unknown> = {}

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formattedParams[key] = value
      }
    })

    return formattedParams
  }

  function updateSearchParams(params: Partial<Parameters<A>[0]>) {
    Object.assign(searchParams, params)
  }

  function resetSearchParams() {
    Object.assign(searchParams, jsonClone(apiParams))
  }

  if (immediate) {
    getData()
  }

  return {
    loading,
    empty,
    data,
    columns,
    columnChecks,
    searchParams,
    reloadColumns,
    getData,
    updateSearchParams,
    resetSearchParams
  }
}
