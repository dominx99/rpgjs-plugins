import { Presets } from '@rpgjs/server'
import { Actor } from '@rpgjs/database'
import HeroActorPreset from '../../../../src/presets/HeroActorPreset'

const { MAXHP } = Presets

/** @ts-ignore */
@Actor({
    ...HeroActorPreset(),
    name: 'Troll',
    description: 'A race of warriors with skin thicker than stone renowned for their brute strength and endurance. They can march 100 kilometers eating only what they encounter on their way. They came to Karvana in search of food and new enemies to face. In battles, the trolls form a compact formation by putting out in the first line the battering rams - the largest individuals with shields and one-handed weapons, called Gyrv, when there is a clash they create a passage for the smaller individuals of their race so called Urla - smaller individuals with incredible agility and unbridled strength. It is said that when an Urla is wounded it goes on a rampage killing everything in sight in its path. Trolls have Yskals in their ranks - two-handed weapon warriors that inflict massive damage in their path. The Yskal uses a banner to achieve a powerful strike, which aids his physical strength and agility.',
    parameters: {
        [MAXHP]: {
            start: 700,
            end: 10000
        }
    },
})
export default class TrollActor {
}
