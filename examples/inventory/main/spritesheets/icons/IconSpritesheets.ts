import { Spritesheet, Animation } from "@rpgjs/client";

@Spritesheet({
    framesWidth: 1,
    framesHeight: 1,
    textures: {
        [Animation.Stand]: {
            animations: [[{ time: 0, frameX: 0, frameY: 0 }]],
        },
    },
})
export default class PotionIconSpritesheets {
}
