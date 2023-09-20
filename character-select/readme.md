# RPG JS Character select plugin
    
## Description
It's a plugin of [RPG JS](https://rpgjs.dev/) engine that gives possibility to select character just after logging in with a GUI.

### Requirements ⚠️
- [title-screen](https://docs.rpgjs.dev/plugins/title-screen.html#title-screen) plugin
- MMORPG type of game

## Features
✅ GUI for selecting actor after first login to game\
✅ Possibility to assign graphics to the clsas

[![Watch the video](https://drive.usercontent.google.com/download?id=1qU6J9uEPyCf4MAtm4DxvJVZHyN8QAgZ8&export=download)](https://drive.google.com/file/d/1QyRBqBB_BEo6xR-bJim-6rgsT-VaTPQg/view?usp=sharing)

## Installation
    
You can easily install the RPG JS Plugin using npm. Open your terminal and run the following command:

```bash
npx rpgjs add rpgjs-myplugin
```

Remember to add plugin to the `rpg.toml`
```toml
modules = [
   'rpg-character-select',
]
```

## Usage

#### 1. You have to define class using extended decorator from this package.

```ts
import { Class } from "rpgjs-character-select";

@Class({
    /* ... other properties */
    graphics: {
        pernament: ['body-light', 'head-light', 'male-spiked2-sandy'],
        baseEquipment: {
            torso: 'shortsleeve-charcoal',
            legs: 'pants-black',
        },
        animations: ['slash'],
    }
})
export default class Archer {}
```
`pernament` are graphics displayed for player everytime.

`baseEquipment` is separated from pernament and animations graphics to have possibility to change them eg. when you want to equip some item and change graphic for it.

`animations` it's array of animations like slash of a sword or casting some skill. ⚠️ This property may be removed in future.

Example:
```
graphics: {
    pernament: ['body-light', 'head-light', 'long-light-ears', 'male-bangslong-platinum'],
    baseEquipment: {
        torso: 'vest-black',
        legs: 'pants-black',
    },
    animations: ['slash', 'fire-ball-cast'],
}
```

#### 2. Next assign this class to the actor

```ts
import { Actor } from '@rpgjs/database'

const { MAXHP } = Presets

@Actor({
    /* other parameters */
    class: Archer
})
export default class Elf {}
```

#### 3. Add actor ids to plugin configuration in the `rpg.toml`

```toml
[characterSelect]
  actors = [
    'human',
    'elf',
    'vampire',
  ]
```

#### 4. Assign actor id to the player and show graphics in `player.ts`
```ts
const player: RpgPlayerHooks = {
    /* ... */
    onCharacterSelected(player: RpgPlayer, actorId: string) {
        player.setActor(actorId);
    },
    onAuthSuccess(player: RpgPlayer) {
        const graphics = player._class.graphics as ClassGraphics;

        player.setGraphic([
            ...graphics.pernament,
            ...graphics.animations,
            ...Object.values(graphics.baseEquipment),
        ]);
    }
}
```

