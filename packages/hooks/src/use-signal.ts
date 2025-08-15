import { computed, ref, shallowRef, triggerRef } from 'vue'
import type {
  ComputedGetter,
  DebuggerOptions,
  Ref,
  ShallowRef,
  WritableComputedOptions,
  WritableComputedRef
} from 'vue'

type Updater<T> = (value: T) => T
type Mutator<T> = (value: T) => void

export interface Signal<T> {
  (): Readonly<T>

  set: (value: T) => void

  update: (updater: Updater<T>) => void

  mutate: (mutator: Mutator<T>) => void

  getRef: () => Readonly<ShallowRef<Readonly<T>>>
}

export interface ReadonlySignal<T> {
  (): Readonly<T>
}

export interface SignalOptions {
  useRef?: boolean
}

export function useSignal<T>(initValue: T, options?: SignalOptions): Signal<T> {
  const { useRef } = options || {}
  const state = useRef ? (ref(initValue) as Ref<T>) : shallowRef(initValue)

  return createSignal(state)
}

export function useComputed<T>(getter: ComputedGetter<T>, debugOptions?: DebuggerOptions): ReadonlySignal<T>

export function useComputed<T>(options: WritableComputedOptions<T>, debugOptions?: DebuggerOptions): Signal<T>

export function useComputed<T>(getterOptions: ComputedGetter<T> | WritableComputedOptions<T>, debugOptions?: DebuggerOptions) {
  const isGetter = typeof getterOptions === 'function'

  const computedValue = computed(getterOptions as any, debugOptions)

  if (isGetter) {
    return () => computedValue.value as ReadonlySignal<T>
  }

  return createSignal(computedValue)
}

function createSignal<T>(state: ShallowRef<T> | WritableComputedRef<T>): Signal<T> {
  const signal = () => state.value

  signal.set = (value: T) => {
    state.value = value
  }

  signal.update = (updater: Updater<T>) => {
    state.value = updater(state.value)
  }

  signal.mutate = (mutator: Mutator<T>) => {
    mutator(state.value)
    triggerRef(state)
  }

  signal.getRef = () => state as Readonly<ShallowRef<Readonly<T>>>

  return signal
}
