import { Animation } from '@rpgjs/client'
import { Direction } from '@rpgjs/common'

export const LPCSpritesheet = () => {
    const frameY = (direction: Direction) => {
        return {
            [Direction.Down]: 2,
            [Direction.Left]: 1,
            [Direction.Right]: 3,
            [Direction.Up]: 0
        }[direction]
    }

    const stand = (direction: Direction) => [{ time: 0, frameX: 1, frameY: frameY(direction) }]
    const anim = (direction: Direction, framesWidth: number, duration: number = 5) => {
        const array: any = []
        for (let i = 0; i < framesWidth; i++) {
            array.push({ time: i * duration, frameX: i, frameY: frameY(direction) })
        }
        array.push({ time: framesWidth * duration })
        return array
    }

    return {
        rectWidth: 64,
        rectHeight: 64,
        spriteRealSize: {
            width: 64,
            height: 64,
        },
        framesWidth: 6,
        framesHeight: 4,
        textures: {
            [Animation.Stand]: {
                offset: {
                    x: 0,
                    y: 512,
                },
                animations: (direction: Direction) => [stand(direction)]
            },
            [Animation.Walk]: {
                offset: {
                    x: 0,
                    y: 512,
                },
                framesWidth: 9,
                framesHeight: 4,
                animations: (direction: Direction) => [anim(direction, 9, 15)]
            },
            [Animation.Attack]: {
                offset: {
                    x: 0,
                    y: 768,
                },
                framesWidth: 6,
                framesHeight: 4,
                animations: (direction: Direction) => [anim(direction, 6, 5)]
            },
            ['shoot']: {
                offset: {
                    x: 0,
                    y: 1024,
                },
                framesWidth: 6,
                framesHeight: 4,
                animations: (direction: Direction) => [anim(direction, 6, 5)]
            }
        },
    }
}
