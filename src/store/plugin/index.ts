import { StoreId } from '@/enum'
import type { PiniaPluginContext } from 'pinia'

import { jsonClone } from '@ca/utils'

const DEFAULT_STORE_IDS = Object.values(StoreId) as string[]

export function resetStore(context: PiniaPluginContext) {
  if (DEFAULT_STORE_IDS.includes(context.store.$id)) {
    const { $state } = context.store
    const defaultStore = jsonClone($state)

    context.store.$reset = () => {
      context.store.$patch(defaultStore)
    }
  }
}
