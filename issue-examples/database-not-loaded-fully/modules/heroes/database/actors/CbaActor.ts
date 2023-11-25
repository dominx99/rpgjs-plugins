import { Presets } from '@rpgjs/server'
import { Actor } from '@rpgjs/database'
import HeroActorPreset from '../../../../src/presets/HeroActorPreset'

const { MAXHP } = Presets

/** @ts-ignore */
@Actor({
    ...HeroActorPreset(),
    name: 'Cba',
    description: 'Cba',
    parameters: {
        [MAXHP]: {
            start: 700,
            end: 10000
        }
    },
})
export default class CbaActor {
}
