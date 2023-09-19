import { Presets } from '@rpgjs/server'
import { Actor } from '@rpgjs/database'
import Archer from '../classes/Archer'

const { MAXHP } = Presets

/** @ts-ignore */
@Actor({
    name: 'Elf',
    description: 'Elves are an ancient and enigmatic race known for their ethereal beauty and deep connection to nature. Standing at an average height of 5 to 6 feet, elves possess slender and graceful bodies that move with an almost otherworldly fluidity. Their skin is typically fair, often with a faint, natural luminescence, and it has an otherworldly quality that seems to shimmer in the moonlight. Elves are known for their striking, almond-shaped eyes, which can come in a wide range of colors including shades of blue, green, amber, and silver. Their eyes are often framed by long, delicate lashes, adding to their captivating appearance. The most defining feature of elves is their long, pointed ears that taper gracefully to a delicate point at the tip. These ears not only enhance their keen sense of hearing but also contribute to their distinctive, elegant look. Elven hair varies in color from shades of blonde, silver, and various shades of brown, often with a natural luster that gives it an enchanting quality. Many elves wear their hair long and flowing, often adorned with intricate braids or adorned with natural elements like leaves, flowers, or feathers to reflect their deep connection to the natural world.',
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
    class: Archer
})
export default class Elf {
}
