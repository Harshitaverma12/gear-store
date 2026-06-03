// Static variant and product config — category-aware

export const LOW_STOCK_THRESHOLD = 3;
export const SALE_DISCOUNT = 0.15;

// ─── Category-aware variant configs ──────────────────────────────────────────

export const CATEGORY_VARIANTS = {
  "men's clothing": {
    type: 'clothing',
    colors: [
      { id: 'navy',    label: 'Navy',    hex: '#1E3A5F' },
      { id: 'black',   label: 'Black',   hex: '#1A1A1A' },
      { id: 'grey',    label: 'Grey',    hex: '#6B7280' },
      { id: 'olive',   label: 'Olive',   hex: '#4D5D2F' },
    ],
    sizes: [
      { id: 'xs',  label: 'XS',  stock: 0  },
      { id: 's',   label: 'S',   stock: 8  },
      { id: 'm',   label: 'M',   stock: 2  },
      { id: 'l',   label: 'L',   stock: 15 },
      { id: 'xl',  label: 'XL',  stock: 0  },
      { id: 'xxl', label: '2XL', stock: 5  },
    ],
    sizeLabel: 'Size',
    sizeChart: {
      title: 'Men\'s Clothing Size Guide',
      note: 'Measurements are body measurements in centimetres.',
      headers: ['Size', 'Chest (cm)', 'Waist (cm)', 'Hips (cm)', 'Height (cm)'],
      rows: [
        ['XS',  '82–87',   '68–73',   '88–93',   '163–168'],
        ['S',   '88–93',   '74–79',   '94–99',   '168–173'],
        ['M',   '94–99',   '80–85',   '100–105', '173–178'],
        ['L',   '100–107', '86–92',   '106–113', '178–183'],
        ['XL',  '108–115', '93–100',  '114–121', '183–188'],
        ['2XL', '116–124', '101–109', '122–130', '188–193'],
      ],
    },
  },

  "women's clothing": {
    type: 'clothing',
    colors: [
      { id: 'blush',   label: 'Blush',   hex: '#D4A0A0' },
      { id: 'ivory',   label: 'Ivory',   hex: '#F0EAD6' },
      { id: 'teal',    label: 'Teal',    hex: '#2D8B7A' },
      { id: 'black',   label: 'Black',   hex: '#1A1A1A' },
    ],
    sizes: [
      { id: 'xs',  label: 'XS',  stock: 4  },
      { id: 's',   label: 'S',   stock: 10 },
      { id: 'm',   label: 'M',   stock: 3  },
      { id: 'l',   label: 'L',   stock: 0  },
      { id: 'xl',  label: 'XL',  stock: 7  },
      { id: 'xxl', label: '2XL', stock: 0  },
    ],
    sizeLabel: 'Size',
    sizeChart: {
      title: 'Women\'s Clothing Size Guide',
      note: 'Measurements are body measurements in centimetres.',
      headers: ['Size', 'Bust (cm)', 'Waist (cm)', 'Hips (cm)', 'Height (cm)'],
      rows: [
        ['XS',  '76–80',   '60–64',  '84–88',   '158–163'],
        ['S',   '81–85',   '65–69',  '89–93',   '163–168'],
        ['M',   '86–90',   '70–74',  '94–98',   '168–173'],
        ['L',   '91–97',   '75–81',  '99–105',  '173–178'],
        ['XL',  '98–105',  '82–89',  '106–113', '178–183'],
        ['2XL', '106–114', '90–98',  '114–122', '183–188'],
      ],
    },
  },

  "electronics": {
    type: 'electronics',
    colors: [
      { id: 'black',    label: 'Black',     hex: '#1A1A1A' },
      { id: 'silver',   label: 'Silver',    hex: '#A8A9AD' },
      { id: 'white',    label: 'White',     hex: '#F5F5F5', border: true },
      { id: 'space',    label: 'Space Grey', hex: '#4A4A4A' },
    ],
    sizes: [
      { id: '128gb',  label: '128 GB',  stock: 12 },
      { id: '256gb',  label: '256 GB',  stock: 8  },
      { id: '512gb',  label: '512 GB',  stock: 2  },
      { id: '1tb',    label: '1 TB',    stock: 0  },
    ],
    sizeLabel: 'Storage',
    sizeChart: {
      title: 'Storage Capacity Guide',
      note: 'Choose based on how much you plan to store on the device.',
      headers: ['Capacity', 'Best For', 'Photos (~12MP)', 'Videos (4K)', 'Apps'],
      rows: [
        ['128 GB', 'Light use',       '~8,000',  '~4 hrs',  'Up to ~50'],
        ['256 GB', 'Everyday user',   '~16,000', '~8 hrs',  'Up to ~100'],
        ['512 GB', 'Power user',      '~32,000', '~16 hrs', 'Up to ~200'],
        ['1 TB',   'Pro / Creator',   '~65,000', '~32 hrs', 'Unlimited'],
      ],
    },
  },

  "jewelery": {
    type: 'jewelery',
    colors: [
      { id: 'gold',      label: 'Gold',       hex: '#CFB53B' },
      { id: 'silver',    label: 'Silver',     hex: '#A8A9AD' },
      { id: 'rose-gold', label: 'Rose Gold',  hex: '#B76E79' },
      { id: 'platinum',  label: 'Platinum',   hex: '#E5E4E2', border: true },
    ],
    sizes: [
      { id: '5',   label: 'US 5',  stock: 3  },
      { id: '6',   label: 'US 6',  stock: 8  },
      { id: '7',   label: 'US 7',  stock: 12 },
      { id: '8',   label: 'US 8',  stock: 5  },
      { id: '9',   label: 'US 9',  stock: 2  },
      { id: '10',  label: 'US 10', stock: 0  },
    ],
    sizeLabel: 'Ring Size',
    sizeChart: {
      title: 'Ring Size Guide',
      note: 'Measure your finger circumference with a tape or strip of paper. Find your size below.',
      headers: ['US Size', 'Circumference (mm)', 'Diameter (mm)', 'UK Size', 'EU Size'],
      rows: [
        ['US 5',  '49.3', '15.7', 'J½', '49'],
        ['US 6',  '51.9', '16.5', 'L½', '52'],
        ['US 7',  '54.4', '17.3', 'N½', '54'],
        ['US 8',  '57.0', '18.1', 'P½', '57'],
        ['US 9',  '59.5', '18.9', 'R½', '60'],
        ['US 10', '62.1', '19.8', 'T½', '62'],
      ],
    },
  },
};

// Fallback for unknown categories
export const DEFAULT_VARIANTS = CATEGORY_VARIANTS["men's clothing"];

export function getVariantsForCategory(category) {
  return CATEGORY_VARIANTS[category] || DEFAULT_VARIANTS;
}

// ─── Specs (category-aware) ───────────────────────────────────────────────────

export const CATEGORY_SPECS = {
  "men's clothing": [
    { key: 'Material',      value: '100% Recycled Polyester' },
    { key: 'Fit',           value: 'Regular fit' },
    { key: 'Care',          value: 'Machine wash cold' },
    { key: 'Pockets',       value: '2 side, 1 chest' },
    { key: 'Packability',   value: 'Packs into chest pocket' },
    { key: 'Certification', value: 'Bluesign® certified' },
  ],
  "women's clothing": [
    { key: 'Material',      value: '95% Cotton, 5% Elastane' },
    { key: 'Fit',           value: 'Slim fit' },
    { key: 'Care',          value: 'Gentle machine wash' },
    { key: 'Lining',        value: 'Fully lined' },
    { key: 'Closure',       value: 'Hidden zip' },
    { key: 'Certification', value: 'GOTS Organic Cotton' },
  ],
  "electronics": [
    { key: 'Connectivity',  value: 'USB 3.0 / USB-C' },
    { key: 'Compatibility', value: 'Windows, macOS, Linux' },
    { key: 'Warranty',      value: '2 years limited' },
    { key: 'Power',         value: 'Bus-powered (no adapter needed)' },
    { key: 'Transfer Speed',value: 'Up to 5 Gbps' },
    { key: 'Certification', value: 'FCC, CE, RoHS' },
  ],
  "jewelery": [
    { key: 'Metal',         value: '18K Gold / 925 Silver' },
    { key: 'Stone',         value: 'Conflict-free diamond / gemstone' },
    { key: 'Finish',        value: 'High polish' },
    { key: 'Hallmark',      value: 'Hallmarked & certified' },
    { key: 'Packaging',     value: 'Gift box included' },
    { key: 'Care',          value: 'Wipe with soft dry cloth' },
  ],
};

export function getSpecsForCategory(category) {
  return CATEGORY_SPECS[category] || CATEGORY_SPECS["men's clothing"];
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const REVIEWS = [
  {
    id: 1,
    author: 'Marcus T.',
    rating: 5,
    date: 'March 2024',
    verified: true,
    title: "Best quality I've seen",
    body: "Exactly as described and arrived quickly. Build quality is excellent — you can tell it will last. Already recommended it to two friends.",
  },
  {
    id: 2,
    author: 'Sarah K.',
    rating: 4,
    date: 'January 2024',
    verified: true,
    title: 'Great product, minor note on sizing',
    body: 'Really solid quality and the details are thorough. Fits true to size. One note — double-check the size guide before ordering.',
  },
  {
    id: 3,
    author: 'Owen R.',
    rating: 5,
    date: 'November 2023',
    verified: false,
    title: 'Worth every penny',
    body: "I kept buying cheaper alternatives and replacing them constantly. Decided to just buy something proper this time. No regrets at all — the quality is obvious.",
  },
];

// ─── Gallery ─────────────────────────────────────────────────────────────────

export const CATEGORY_GALLERY = {
  "men's clothing": [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=900&q=80',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&q=80',
    'https://images.unsplash.com/photo-1617196034183-421b4040d7cd?w=900&q=80',
  ],
  "women's clothing": [
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80',
    'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=900&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4b4646?w=900&q=80',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=900&q=80',
  ],
  "electronics": [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&q=80',
  ],
  "jewelery": [
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80',
    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&q=80',
    'https://images.unsplash.com/photo-1573408301185-9519f94ae9b3?w=900&q=80',
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=80',
  ],
};

export function getGalleryImages(productId, category, apiImage) {
  const pool = CATEGORY_GALLERY[category] || CATEGORY_GALLERY["men's clothing"];
  const offset = productId % pool.length;
  const extras = [...pool.slice(offset), ...pool.slice(0, offset)];
  return [apiImage, ...extras].slice(0, 5);
}

export function scalePrice(rawPrice) {
  return parseFloat((rawPrice * 3.2).toFixed(2));
}
