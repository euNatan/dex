export const CONDITIONS = [
  { id: 1, name: 'Near Mint', short_name: 'NM' },
  { id: 2, name: 'Slightly Played', short_name: 'SP' },
  { id: 3, name: 'Moderately Played', short_name: 'MP' },
  { id: 4, name: 'Heavily Played', short_name: 'HP' },
  { id: 5, name: 'Damaged', short_name: 'D' },
]

export const SETS = [
  {
    id: 1,
    name: 'Scarlet & Violet',
    code: 'SVI',
    series: 'Scarlet & Violet',
    total_in_collection: 198,
    release_date: '2023-03-31',
    accent: '#7c3aed',
  },
  {
    id: 2,
    name: 'Paldea Evolved',
    code: 'PAL',
    series: 'Scarlet & Violet',
    total_in_collection: 193,
    release_date: '2023-06-09',
    accent: '#0ea5e9',
  },
  {
    id: 3,
    name: 'Obsidian Flames',
    code: 'OBF',
    series: 'Scarlet & Violet',
    total_in_collection: 197,
    release_date: '2023-08-11',
    accent: '#ed3743',
  },
  {
    id: 4,
    name: '151',
    code: 'MEW',
    series: 'Scarlet & Violet',
    total_in_collection: 165,
    release_date: '2023-09-22',
    accent: '#f9ac05',
  },
  {
    id: 5,
    name: 'Surging Sparks',
    code: 'SSP',
    series: 'Scarlet & Violet',
    total_in_collection: 191,
    release_date: '2024-11-08',
    accent: '#eab308',
  },
]

export const PRODUCTS = [
  { id: 101, name: 'Miraidon ex', card_number: '081', code: 'SVI-081', rarity: 'Double Rare', type: 'lightning', hp: 220, set_id: 1, prices: { 1: 68.9, 2: 52, 3: 39, 4: 0, 5: 0 } },
  { id: 102, name: 'Koraidon ex', card_number: '125', code: 'SVI-125', rarity: 'Double Rare', type: 'fighting', hp: 230, set_id: 1, prices: { 1: 54.5, 2: 41, 3: 28, 4: 0, 5: 0 } },
  { id: 103, name: 'Sprigatito', card_number: '013', code: 'SVI-013', rarity: 'Common', type: 'grass', hp: 70, set_id: 1, prices: { 1: 2.5, 2: 1.5, 3: 1, 4: 0, 5: 0 } },
  { id: 104, name: 'Fuecoco', card_number: '032', code: 'SVI-032', rarity: 'Common', type: 'fire', hp: 80, set_id: 1, prices: { 1: 3.9, 2: 2, 3: 1, 4: 0, 5: 0 } },
  { id: 105, name: 'Quaxly', card_number: '050', code: 'SVI-050', rarity: 'Common', type: 'water', hp: 70, set_id: 1, prices: { 1: 2.9, 2: 1.8, 3: 1, 4: 0, 5: 0 } },
  { id: 106, name: 'Nemona', card_number: '250', code: 'SVI-250', rarity: 'Ultra Rare', type: 'colorless', hp: null, set_id: 1, prices: { 1: 42, 2: 31, 3: 22, 4: 0, 5: 0 } },

  { id: 201, name: 'Iono', card_number: '269', code: 'PAL-269', rarity: 'Special Illustration Rare', type: 'lightning', hp: null, set_id: 2, prices: { 1: 189, 2: 150, 3: 110, 4: 0, 5: 0 } },
  { id: 202, name: 'Magikarp', card_number: '033', code: 'PAL-033', rarity: 'Illustration Rare', type: 'water', hp: 30, set_id: 2, prices: { 1: 76, 2: 58, 3: 40, 4: 0, 5: 0 } },
  { id: 203, name: 'Ditto', card_number: '201', code: 'PAL-201', rarity: 'Illustration Rare', type: 'colorless', hp: 70, set_id: 2, prices: { 1: 48, 2: 36, 3: 24, 4: 0, 5: 0 } },
  { id: 204, name: 'Chien-Pao ex', card_number: '061', code: 'PAL-061', rarity: 'Double Rare', type: 'water', hp: 220, set_id: 2, prices: { 1: 22.5, 2: 16, 3: 11, 4: 0, 5: 0 } },
  { id: 205, name: 'Tinkaton', card_number: '105', code: 'PAL-105', rarity: 'Rare', type: 'psychic', hp: 140, set_id: 2, prices: { 1: 8.9, 2: 6, 3: 4, 4: 0, 5: 0 } },

  { id: 301, name: 'Charizard ex', card_number: '223', code: 'OBF-223', rarity: 'Special Illustration Rare', type: 'fire', hp: 330, set_id: 3, prices: { 1: 890, 2: 720, 3: 510, 4: 0, 5: 0 } },
  { id: 302, name: 'Charmander', card_number: '004', code: 'OBF-004', rarity: 'Common', type: 'fire', hp: 70, set_id: 3, prices: { 1: 4.5, 2: 3, 3: 2, 4: 0, 5: 0 } },
  { id: 303, name: 'Pidgeot ex', card_number: '164', code: 'OBF-164', rarity: 'Ultra Rare', type: 'colorless', hp: 280, set_id: 3, prices: { 1: 64, 2: 48, 3: 32, 4: 0, 5: 0 } },
  { id: 304, name: 'Ninetales', card_number: '028', code: 'OBF-028', rarity: 'Uncommon', type: 'fire', hp: 120, set_id: 3, prices: { 1: 6.5, 2: 4, 3: 2.5, 4: 0, 5: 0 } },
  { id: 305, name: 'Eiscue', card_number: '042', code: 'OBF-042', rarity: 'Uncommon', type: 'water', hp: 110, set_id: 3, prices: { 1: 3.2, 2: 2, 3: 1, 4: 0, 5: 0 } },

  { id: 401, name: 'Mew ex', card_number: '151', code: 'MEW-151', rarity: 'Ultra Rare', type: 'psychic', hp: 180, set_id: 4, prices: { 1: 320, 2: 250, 3: 180, 4: 0, 5: 0 } },
  { id: 402, name: 'Pikachu', card_number: '025', code: 'MEW-025', rarity: 'Common', type: 'lightning', hp: 70, set_id: 4, prices: { 1: 45, 2: 32, 3: 20, 4: 0, 5: 0 } },
  { id: 403, name: 'Charizard', card_number: '006', code: 'MEW-006', rarity: 'Rare', type: 'fire', hp: 180, set_id: 4, prices: { 1: 58, 2: 42, 3: 28, 4: 0, 5: 0 } },
  { id: 404, name: 'Blastoise', card_number: '009', code: 'MEW-009', rarity: 'Rare', type: 'water', hp: 170, set_id: 4, prices: { 1: 36, 2: 26, 3: 18, 4: 0, 5: 0 } },
  { id: 405, name: 'Venusaur', card_number: '003', code: 'MEW-003', rarity: 'Rare', type: 'grass', hp: 190, set_id: 4, prices: { 1: 34, 2: 24, 3: 16, 4: 0, 5: 0 } },
  { id: 406, name: 'Alakazam', card_number: '065', code: 'MEW-065', rarity: 'Rare', type: 'psychic', hp: 140, set_id: 4, prices: { 1: 18, 2: 12, 3: 8, 4: 0, 5: 0 } },
  { id: 407, name: 'Snorlax', card_number: '143', code: 'MEW-143', rarity: 'Uncommon', type: 'colorless', hp: 160, set_id: 4, prices: { 1: 9.5, 2: 6, 3: 4, 4: 0, 5: 0 } },

  { id: 501, name: 'Pikachu ex', card_number: '238', code: 'SSP-238', rarity: 'Special Illustration Rare', type: 'lightning', hp: 200, set_id: 5, prices: { 1: 410, 2: 330, 3: 240, 4: 0, 5: 0 } },
  { id: 502, name: 'Latias ex', card_number: '076', code: 'SSP-076', rarity: 'Double Rare', type: 'psychic', hp: 220, set_id: 5, prices: { 1: 28, 2: 20, 3: 14, 4: 0, 5: 0 } },
  { id: 503, name: 'Hydreigon ex', card_number: '119', code: 'SSP-119', rarity: 'Double Rare', type: 'dark', hp: 330, set_id: 5, prices: { 1: 19.9, 2: 14, 3: 9, 4: 0, 5: 0 } },
  { id: 504, name: 'Tapu Koko', card_number: '068', code: 'SSP-068', rarity: 'Rare', type: 'lightning', hp: 120, set_id: 5, prices: { 1: 7.5, 2: 5, 3: 3, 4: 0, 5: 0 } },
]

export const SEED_INVENTORY = [
  { id: 1, product_id: 301, condition_id: 1, quantity: 1 },
  { id: 2, product_id: 401, condition_id: 1, quantity: 1 },
  { id: 3, product_id: 402, condition_id: 1, quantity: 4 },
  { id: 4, product_id: 201, condition_id: 1, quantity: 1 },
  { id: 5, product_id: 501, condition_id: 2, quantity: 1 },
  { id: 6, product_id: 403, condition_id: 1, quantity: 2 },
  { id: 7, product_id: 101, condition_id: 1, quantity: 2 },
  { id: 8, product_id: 102, condition_id: 1, quantity: 1 },
  { id: 9, product_id: 202, condition_id: 1, quantity: 1 },
  { id: 10, product_id: 103, condition_id: 1, quantity: 6 },
  { id: 11, product_id: 104, condition_id: 1, quantity: 3 },
  { id: 12, product_id: 302, condition_id: 1, quantity: 8 },
  { id: 13, product_id: 303, condition_id: 2, quantity: 1 },
  { id: 14, product_id: 404, condition_id: 1, quantity: 1 },
  { id: 15, product_id: 405, condition_id: 1, quantity: 1 },
  { id: 16, product_id: 203, condition_id: 1, quantity: 2 },
  { id: 17, product_id: 407, condition_id: 3, quantity: 1 },
  { id: 18, product_id: 502, condition_id: 1, quantity: 2 },
  { id: 19, product_id: 106, condition_id: 1, quantity: 1 },
  { id: 20, product_id: 305, condition_id: 1, quantity: 2 },
]

export const TYPE_COLORS = {
  lightning: { from: '#f4d03f', to: '#b7950b', ink: '#1a1403' },
  fire: { from: '#ed3743', to: '#7a1018', ink: '#fff5f5' },
  water: { from: '#3b82f6', to: '#155ba3', ink: '#f4f7fb' },
  grass: { from: '#22c55e', to: '#166534', ink: '#f4f7fb' },
  fighting: { from: '#ff8c27', to: '#9a3412', ink: '#fff7ed' },
  psychic: { from: '#e879f9', to: '#7e22ce', ink: '#fdf4ff' },
  dark: { from: '#64748b', to: '#0f172a', ink: '#f8fafc' },
  colorless: { from: '#cbd5e1', to: '#475569', ink: '#0f172a' },
  dragon: { from: '#a78bfa', to: '#5b21b6', ink: '#f5f3ff' },
  metal: { from: '#94a3b8', to: '#334155', ink: '#f8fafc' },
}

export function getSet(setId) {
  return SETS.find((set) => set.id === setId) || null
}

export function getProduct(productId) {
  return PRODUCTS.find((product) => product.id === productId) || null
}

export function getCondition(conditionId) {
  return CONDITIONS.find((condition) => condition.id === conditionId) || null
}

export function hydrateProduct(product) {
  const set = getSet(product.set_id)
  return {
    ...product,
    product_type: product.product_type || 'card',
    collection: set
      ? [{
          id: set.id,
          name: set.name,
          image: set.code,
          code: set.code,
          series: set.series,
          release_date: set.release_date,
          total_in_collection: set.total_in_collection,
        }]
      : [],
  }
}
