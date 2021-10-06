export type Store = {
  [tabId: number]: History[]
}

export type History = {
  tab: Tab,
  timestamp: number,
  objectUrl: string,
  faviconUrl: string
}
