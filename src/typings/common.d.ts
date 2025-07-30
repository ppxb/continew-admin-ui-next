declare namespace CommonType {
  type Option<K = string, V = string> = { value: K, label: V }

  type YesOrNo = 'Y' | 'N'
}
