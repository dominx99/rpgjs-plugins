import { Presets } from '@rpgjs/server'
import { Actor } from '@rpgjs/database'
import Mage from '../classes/Mage'

const { MAXHP } = Presets

/** @ts-ignore */
@Actor({
    name: 'Vampire',
    description: 'Count Draven Bloodthorn possesses an otherworldly, beguiling beauty that conceals his sinister nature. He stands at six feet tall, with a lean and graceful build. His skin is pallid, resembling alabaster, and his eyes are a mesmerizing shade of crimson that seems to glow in the dark. His sharp, angular features exude an air of aristocratic elegance, while his long, jet-black hair cascades down to his shoulders. Count Draven Bloodthorn is the embodiment of charm and charisma. He possesses an air of sophistication and refinement that can be disarming to those who encounter him. He is a master manipulator and is skilled at playing on the desires and weaknesses of others to further his own goals. Draven is intelligent and cunning, always thinking several steps ahead in his intricate schemes. He has a deep-seated thirst for blood, which he indulges in with cold and calculated precision.',
    initialLevel: 1,
    finalLevel: 250,
    expCurve: {
        basis: 30,
        extra: 20,
        accelerationA: 30,
        accelerationB: 30
    },
    startingEquipment: [],
    parameters: {
        [MAXHP]: {
            start: 300,
            end: 1500
        }
    },
    class: Mage
})
export default class Vampire {
}
