import { Presets } from '@rpgjs/server'
import { Actor } from '@rpgjs/database'
import Warrior from '../classes/Warrior'

const { MAXHP } = Presets

/** @ts-ignore */
@Actor({
    name: 'Human',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc mattis tempor dolor, quis accumsan eros suscipit non. Phasellus at augue ullamcorper neque maximus porttitor in quis est. Donec mi augue, sagittis nec eros lacinia, tincidunt tempus metus. Maecenas rhoncus orci id cursus scelerisque. Suspendisse imperdiet sapien eu velit finibus, at eleifend elit scelerisque. Etiam eget sapien nec tellus ultrices aliquet. Ut faucibus accumsan augue, in porta sapien placerat ut. Nulla scelerisque nunc et lorem tincidunt, vehicula tempor justo pulvinar. Aenean vel urna varius, lacinia sem ut, eleifend velit. Donec feugiat, velit eget efficitur elementum, dui velit commodo ipsum, quis mollis est est nec arcu. Nullam consequat urna et laoreet tempus. Curabitur pellentesque nulla neque, vel pulvinar leo finibus sit amet. Phasellus non egestas nisi. Aliquam suscipit vestibulum metus, eget facilisis dolor facilisis vitae.',
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
    class: Warrior
})
export default class Human {
}
