import { Presets } from '@rpgjs/server'
import { Actor } from '@rpgjs/database'
import HeroActorPreset from '../../../../src/presets/HeroActorPreset'

const { MAXHP } = Presets

/** @ts-ignore */
@Actor({
    ...HeroActorPreset(),
    name: 'Orc',
    description: 'A warrior is a person specializing in combat or warfare, especially within the context of a tribal or clan-based warrior culture society that recognizes a separate warrior class or caste.',
    parameters: {
        [MAXHP]: {
            start: 700,
            end: 10000
        }
    },
})
export default class OrcActor {
}
