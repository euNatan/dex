const PREFIX = 'dex-set-view:'

function storageKey(viewKey) {
  return `${PREFIX}${viewKey || 'unknown'}`
}

function read(viewKey) {
  try {
    const raw = sessionStorage.getItem(storageKey(viewKey))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function loadSetViewState(viewKey) {
  const saved = read(viewKey)
  return {
    filter: saved?.filter || 'all',
    registerMode: typeof saved?.registerMode === 'boolean' ? saved.registerMode : true,
    scrollTop: Number(saved?.scrollTop || 0),
  }
}

export function saveSetViewState(viewKey, partial) {
  const current = loadSetViewState(viewKey)
  try {
    sessionStorage.setItem(storageKey(viewKey), JSON.stringify({
      ...current,
      ...partial,
    }))
  } catch {
    // ignore quota / private mode
  }
}

export function dexBody() {
  return document.querySelector('.dex-body')
}

export function saveSetScroll(viewKey) {
  saveSetViewState(viewKey, { scrollTop: dexBody()?.scrollTop || 0 })
}

export function restoreSetScroll(viewKey) {
  const { scrollTop } = loadSetViewState(viewKey)
  requestAnimationFrame(() => {
    dexBody()?.scrollTo({ top: scrollTop })
  })
}
