This repository includes plugins written by me and examples how to use them

## Plugins

### Character select

Requirements ⚠️
- title-screen plugin
- MMORPG type of game

--- 
It allows player to select actor.\
This plugin extends original `@Class` decorator with possibility to set `graphics` of a class

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

