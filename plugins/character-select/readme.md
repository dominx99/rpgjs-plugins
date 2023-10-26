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
npx rpgjs add rpgjs-character-select
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
    /* ... other parameters */
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

### ⚠️  Important ⚠️
Keep in mind that that `onCharacterSelected` hook is executed before `onAuthSuccess`

## Customization

You can override variables and styles in [theme.scss](https://docs.rpgjs.dev/gui/theme.html#customize-guis)

```scss
/* variables */

$character-select-screen-background: url('../assets/backgrounds/character-select.png');
$character-select-arrow-left-image: url('../assets/gui/arrow-left.png') !default;
$character-select-arrow-right-image: url('../assets/gui/arrow-right.png') !default;
$window-button-success-color: #1c8634;
$window-button-success-shadow: #0d4c30;
$window-button-color: rgba(128, 130, 162, 0.7);
$window-button-shadow: rgb(128, 130, 162);

/* styles */

.character-select {
  &__class-name {
    color: $primary;
  }

  &__arrow-left {
    width: 75px;
    height: 75px;

    &:hover {
      background: url('@/modules/config/assets/gui/shared/left_arrow_h.png');
      background-size: 100% 100%;
      filter: brightness(1);
    }
  }

  &__arrow-right {
    width: 75px;
    height: 75px;

    &:hover {
      background: url('@/modules/config/assets/gui/shared/right_arrow_h.png');
      background-size: 100% 100%;
    }
  }

  &__submit-button {
    width: 200px;
    height: 75px;
    font-weight: normal;

    &:hover {
      box-shadow: none;
    }
  }

  &__description-content {
    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        background: url('@/modules/config/assets/gui/boxes/news_top_ornament.png');
        background-size: 100% 100%;
        width: 100%;
        height: 35px;
        margin-top: -32px;
        filter: brightness(1.5);
    }

    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background: url('@/modules/config/assets/gui/boxes/news_bottom.png');
      background-size: 100% 100%;
      width: 50%;
      height: 35px;
      margin-bottom: -32px;
      filter: brightness(1.5);
    }

    &::-webkit-scrollbar-track {
      background: #fff;
      width: 7px;
    }

    &::-webkit-scrollbar {
      background: #fff;
      width: 7px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, .5);

      &:hover {
        background: rgba(0, 0, 0, .7);
      }
    }
  }
}
```

![Custom view](https://drive.usercontent.google.com/download?id=16dqE2RLCZSShRo01xABm12WqCMUwo2b3&export=download)
