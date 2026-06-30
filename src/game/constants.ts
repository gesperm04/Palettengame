// Europalette: 1200 x 800 mm -> game units in meters
export const PALLET_WIDTH = 1.2
export const PALLET_DEPTH = 0.8
export const PALLET_HEIGHT = 0.16
export const GOODS_HEIGHT = 0.9

export const GARAGE_WIDTH = 12 // x: -6..6
export const GARAGE_DEPTH = 10 // z: -5..5
export const GATE_WIDTH = 6.5

// Floor storage slots: 4 rows x 5 columns = 20 slots along the back wall
export const SLOT_COLS = 5
export const SLOT_ROWS = 4
export const SLOT_SPACING_X = 1.6
export const SLOT_SPACING_Z = 1.4
export const SLOT_ORIGIN_X = -((SLOT_COLS - 1) * SLOT_SPACING_X) / 2
export const SLOT_ORIGIN_Z = -3.6

// Delivery zone just outside the open gate, where the truck parks and pallets line up
export const DELIVERY_ORIGIN_X = -3.0
export const DELIVERY_ORIGIN_Z = 7.2
export const DELIVERY_SPACING = 1.3
export const DELIVERY_ROW_LENGTH = 5
export const DELIVERY_ROW_GAP = 1.3

// "Kein Polster": das Startkapital wurde bereits vollständig für die erste
// Miete und den gebrauchten Handgabelhubwagen ausgegeben.
export const STARTING_CASH = 0
export const RENT_PER_DAY = 180
export const HAND_JACK_MAX_KG = 2200

// Wo der Handgabelhubwagen geparkt ist, bis er aufgenommen wird
export const JACK_PARK_POSITION: [number, number, number] = [4.4, 0, 0.5]
export const JACK_PARK_ROTATION_Y = Math.PI / 2
export const JACK_PICKUP_RANGE = 1.6

export function deliveryPosition(index: number): [number, number, number] {
  const col = index % DELIVERY_ROW_LENGTH
  const row = Math.floor(index / DELIVERY_ROW_LENGTH)
  return [
    DELIVERY_ORIGIN_X + col * DELIVERY_SPACING,
    0,
    DELIVERY_ORIGIN_Z + row * DELIVERY_ROW_GAP,
  ]
}

export function slotPosition(gridX: number, gridZ: number): [number, number, number] {
  return [SLOT_ORIGIN_X + gridX * SLOT_SPACING_X, 0, SLOT_ORIGIN_Z + gridZ * SLOT_SPACING_Z]
}
