import useBoolean from './use-boolean'

export default function useLoading() {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean()

  return {
    loading,
    startLoading,
    endLoading
  }
}
