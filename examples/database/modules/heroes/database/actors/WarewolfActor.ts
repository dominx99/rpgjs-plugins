import { Presets } from '@rpgjs/server'
import { Actor } from '@rpgjs/database'
import HeroActorPreset from '../../../../src/presets/HeroActorPreset'

const { MAXHP } = Presets

/** @ts-ignore */
@Actor({
    ...HeroActorPreset(),
    name: 'Warewolf',
    description: 'Werewolves were created by deities by accident as a result of war and the alteration of the functioning of the universe by the moon god Teran. Teran, wanting to defeat his enemy Suvra, created through the reversal of the phases of the moon and his power a race of werewolves, who were descended from animals and, through a change in genotype and the proper operation of the moon, inherited Teran\'s abilities. Initially, the creation of the army went well, until through too much implementation of their power and Suvra\'s interference, the Werewolves gained their own consciousness and reasoning ability. Suvra tried to turn Teran\'s creation against him at all costs. When the genotype was changed in favor of the sun god, the Werewolves subconsciously sensed the situation they were in and, using wild instinct, freed themselves from their creator\'s shackles and, through the power inherited from him, managed to block and protect their minds from the moon god himself.',
    parameters: {
        [MAXHP]: {
            start: 700,
            end: 10000
        }
    },
})
export default class WarewolfActor {
}
