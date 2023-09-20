# RPG JS Character select plugin
    
## Description

 Requirements ⚠️
- title-screen plugin
- MMORPG type of game

## Features
This plugin allows player to select actor.

[![Watch the video](https://drive.usercontent.google.com/download?id=1qU6J9uEPyCf4MAtm4DxvJVZHyN8QAgZ8&export=download)](https://drive.google.com/file/d/1QyRBqBB_BEo6xR-bJim-6rgsT-VaTPQg/view?usp=sharing)

You have to define class using extended decorator from this package.

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
    
## Installation
    
You can easily install the RPG JS Plugin using npm. Open your terminal and run the following command:

```bash
npx rpgjs add rpgjs-myplugin
```

## Usage

...

## License

...
