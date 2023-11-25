import { Presets } from '@rpgjs/server'
import { Actor } from '@rpgjs/database'
import HeroActorPreset from '../../../../src/presets/HeroActorPreset'

const { MAXHP } = Presets

/** @ts-ignore */
@Actor({
    ...HeroActorPreset(),
    name: 'Elf',
    description: 'A race full of magic and belief in nature deities and ancient rituals. Elves were divided into tribes, with each tribe ruling a different area and believing in a different deity. In the north (Azgurath) they believed in Alara, the Lady of the eternal cold; in the west, Raitenvil (Fire); in the east, Tivius, the ruler of the storm; and in the south, Raja, the goddess of nature and guardian of the forests. The tribes set out to conquer Karvana because of the artifacts they had only heard about from legends, each tribe wanted power to subjugate the rest of the tribes. The elves of the north possessed power through blood rituals in honor of Alara, who in gratitude marked the tribe with her own cold magic. The most prominent chosen ones were able to cause entire seas to ice over and bring cataclysm to a chosen area just by using thought.',
    parameters: {
        [MAXHP]: {
            start: 700,
            end: 10000
        }
    },
})
export default class ElfActor {
}
