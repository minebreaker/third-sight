type Event<L> = {
  addListener: ( listener: L ) => void,
  removeListener: ( listener: L ) => void
  hasListener: ( listener: L ) => void
}

type Session = {
  lastModified: number,
  tab?: Tab,
  window?: any
}

type TabIdNone = undefined

/**
 * With a `<all_urls>` permission, we can safely assume to have some properties
 */
type Tab = {
  active: boolean,
  attention?: boolean,
  audible?: boolean,
  autoDiscardable?: boolean,
  cookieStoreId?: string,
  discarded?: boolean,
  favIconUrl: string,
  height?: number,
  hidden: boolean,
  highlighted: boolean,
  // Not sure when id is undefined
  id: number | TabIdNone,
  incognito: boolean,
  index: number,
  isArticle: boolean,
  isInReaderMode: boolean,
  lastAccessed: number,
  mutedInfo?: any,
  openerTabId?: number,
  pinned?: boolean,
  selected: boolean,
  sessionId?: string,
  status?: string,
  successorTabId?: number,
  title: string,
  url: string,
  width?: number,
  windowId: number
}

declare const browser: {
  runtime: {
    id: string,
    sendMessage: <T, R> ( message: T ) => Promise<R>,
    onMessage: Event<<T, U, R> ( message: T, sender: U ) => R>,
    onStartup: Event<() => void>
  }
  sessions: {
    getRecentlyClosed: ( filter?: { maxResults?: number } ) => Promise<Session[]>,
    onChanged: Event<() => void>
  },
  tabs: {
    captureTab: ( tabId?: number, options?: unknown ) => Promise<string>,
    create: ( createProperties: { url?: string } ) => Promise<Tab>,
    get: ( tabId: number ) => Promise<Tab>,
    query: ( queryObj: { active?: boolean, currentWindow?: boolean, url?: string } ) => Promise<Tab[]>,
    update: ( updateProperties: { url?: string } ) => Promise<Tab>,
    highlight: ( highlightInfo: { windowId?: number, populate?: boolean, tabs?: number[] } ) => Promise<Window>,
    TAB_ID_NONE: TabIdNone,
    onRemoved: Event<( tabId: number, removeInfo: { windowId: number, isWindowClosing: boolean } ) => Promise<void>>
  },
  webNavigation: {
    onCompleted: Event<( details: { tabId: number, url: string, processId: string, frameId: number, timeStamp: number } ) => void>
  }
}
