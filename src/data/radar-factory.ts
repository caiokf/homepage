import { Radar } from '../models/radar'
import { Quadrant } from '../models/quadrant'
import { Ring } from '../models/ring'
import { Blip, type BlipStatus } from '../models/blip'
import type { RawRadarData } from './types'
import { RING_NAMES, QUADRANT_NAMES } from '../config/radar-config'

export function createRadarFromData(data: RawRadarData): Radar {
  const radar = new Radar()

  // Create rings from config or data
  const ringNames = data.rings || [...RING_NAMES]
  const rings: Record<string, Ring> = {}
  ringNames.forEach((name, index) => {
    rings[name.toLowerCase()] = new Ring(name, index)
  })
  radar.addRings(rings)

  // Create quadrants and add blips
  const quadrantNames = data.quadrants || [...QUADRANT_NAMES]
  const quadrantMap = new Map<string, Quadrant>()

  quadrantNames.forEach((name) => {
    const quadrant = new Quadrant(name)
    quadrantMap.set(name.toLowerCase(), quadrant)
  })

  // Add blips to their respective quadrants
  data.blips.forEach((rawBlip) => {
    const ring = rings[rawBlip.ring.toLowerCase()]
    if (!ring) {
      console.warn(`Unknown ring: ${rawBlip.ring}`)
      return
    }

    const quadrant = quadrantMap.get(rawBlip.quadrant.toLowerCase())
    if (!quadrant) {
      console.warn(`Unknown quadrant: ${rawBlip.quadrant}`)
      return
    }

    const blip = new Blip(
      rawBlip.name,
      ring,
      rawBlip.isNew,
      rawBlip.status as BlipStatus,
      rawBlip.topic,
      rawBlip.description
    )

    quadrant.add(blip)
  })

  // Add quadrants to radar in order
  quadrantNames.forEach((name) => {
    const quadrant = quadrantMap.get(name.toLowerCase())
    if (quadrant) {
      radar.addQuadrant(quadrant)
    }
  })

  return radar
}
