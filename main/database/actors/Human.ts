import { Presets } from '@rpgjs/server'
import { Actor } from '@rpgjs/database'
import Warrior from '../classes/Warrior'

const { MAXHP } = Presets

/** @ts-ignore */
@Actor({
    name: 'Human',
    description: 'Sir Cedric Stormblade is a rugged and imposing figure, standing at six feet tall with a broad, muscular build. His skin is sun-kissed from years of exposure to the elements, and he bears the scars of numerous battles, a testament to his warrior\'s life. His sharp, chiseled features are framed by a mane of jet-black hair, which falls to his shoulders. His eyes are a striking shade of deep blue, reflecting a combination of determination and wisdom. Sir Cedric Stormblade is a man of honor and unwavering principles. He upholds a strong moral code and is guided by a deep sense of duty to protect the innocent and uphold justice. He is courageous and unflinching in the face of danger, always willing to put himself on the front lines to shield his comrades. Cedric is a stoic individual who values loyalty and camaraderie, and he is fiercely protective of his friends. Cedric hails from a noble family with a long history of serving as knights and defenders of their homeland. He chose the path of a wandering adventurer to seek out challenges beyond his family\'s estate and make a name for himself through deeds rather than lineage. Over the years, he has become a renowned hero, known for his unwavering dedication to justice and his unyielding resolve in the face of adversity.',
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
