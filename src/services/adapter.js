import { productImage, resolveMediaUrl, slugify } from '../lib/media'

function firstCollection(product) {
  const collection = product?.collection
  if (Array.isArray(collection) && collection.length) return collection[0]
  return collection || {}
}

export function adaptGrouped(raw) {
  const data = {}

  Object.entries(raw || {}).forEach(([name, group]) => {
    const cards = group?.cards || {}
    const first = Object.values(cards)[0]
    const collection = firstCollection(first?.product)
    const code = collection.code || slugify(name)

    data[name] = {
      name,
      image: resolveMediaUrl(group?.image || collection.image || ''),
      accent: collection.accent || '#155ba3',
      code,
      series: collection.series || '',
      total_in_collection: Number(collection.total_in_collection || 0),
      release_date: collection.release_date || collection.collection_date || '',
      set_id: collection.id || 0,
      collection_price: Number(group?.collection_price || 0),
      precified: Number(group?.precified || 0),
      registred: Number(group?.registred || 0),
      cards,
    }
  })

  return data
}

export function adaptSearchHit(row) {
  const product = row?.product || row
  if (!product?.id) return null

  const collection = firstCollection(product)

  return {
    id: product.id,
    name: product.name,
    card_number: product.card_number,
    code: product.code,
    type: product.type || 'colorless',
    rarity: product.raritie?.name || product.rarity || '',
    hp: product.hp || null,
    image: productImage(product),
    collection: product.collection || (collection.id ? [collection] : []),
    market_price: Number(row?.price || product.product_store_min?.price || 0),
    condition_id: row?.condition_id || null,
  }
}

export function adaptCategory(row) {
  if (!row?.id && !row?.name) return null

  return {
    id: row.id,
    set_id: row.id,
    name: row.name,
    code: row.code || slugify(row.name),
    series: row.series || '',
    image: resolveMediaUrl(row.image || ''),
    total_in_collection: Number(row.total_in_collection || 0),
    release_date: row.release_date || row.collection_date || '',
    accent: '#155ba3',
    uniqueOwned: 0,
    collection_price: 0,
  }
}

export function adaptSetCard(row) {
  if (!row?.id && !row?.api_id) return null

  return {
    id: row.id || null,
    api_id: row.api_id || null,
    name: row.name,
    card_number: row.card_number,
    code: row.code,
    product_type: row.product_type || 'card',
    hp: row.hp || null,
    image: productImage(row) || resolveMediaUrl(row.image || ''),
    market_price: Number(row.market_price || 0),
    listing_price: Number(row.listing_price || 0),
    last_sold_price: Number(row.last_sold_price || 0),
    price_source: row.price_source || null,
    collection: row.collection || [],
    source: row.source || (row.id ? 'liga' : 'storage'),
    storage_card: row.storage_card || null,
  }
}

export function uniqueProducts(rows) {
  const seen = new Set()
  const list = []

  rows.forEach((row) => {
    const item = adaptSearchHit(row)
    if (!item || seen.has(item.id)) return
    seen.add(item.id)
    list.push(item)
  })

  return list
}
