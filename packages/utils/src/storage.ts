import localforage from 'localforage'

type StorageType = 'local' | 'session'

export function createStorage<T extends object>(type: StorageType, prefix: string) {
  const storage = type === 'session' ? window.sessionStorage : window.localStorage

  const getKey = (key: keyof T): string => `${prefix}${String(key)}`

  return {
    set<K extends keyof T>(key: K, value: T[K]) {
      const item = JSON.stringify(value)
      storage.setItem(getKey(key), item)
    },
    get<K extends keyof T>(key: K): T[K] | null {
      const item = storage.getItem(getKey(key))
      if (item) {
        const parsed: T[K] | null = JSON.parse(item)

        if (parsed) {
          return parsed as T[K]
        }
      }
      storage.removeItem(getKey(key))
      return null
    },
    remove(key: keyof T) {
      storage.removeItem(getKey(key))
    },
    clear() {
      storage.clear()
    }
  }
}

type LocalForage<T extends object> = Omit<typeof localforage, 'getItem' | 'setItem' | 'removeItem'> & {
  getItem: <K extends keyof T>(key: K, callback?: (err: any, value: T[K] | null) => void) => Promise<T[K] | null>
  setItem: <K extends keyof T>(key: K, value: T[K], callback?: (err: any, value: T[K]) => void) => Promise<T[K]>
  removeItem: (key: keyof T, callback?: (err: any) => void) => Promise<void>
}

type LocalforageDriver = 'local' | 'indexedDB' | 'webSQL'

export function createLocalforage<T extends object>(driver: LocalforageDriver) {
  const driverMap: Record<LocalforageDriver, string> = {
    local: localforage.LOCALSTORAGE,
    indexedDB: localforage.INDEXEDDB,
    webSQL: localforage.WEBSQL
  }

  localforage.config({
    driver: driverMap[driver]
  })
  return localforage as LocalForage<T>
}
