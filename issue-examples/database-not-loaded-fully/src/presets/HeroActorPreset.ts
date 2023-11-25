const HeroActorPreset = () => {
    return {
        initialLevel: 1,
        finalLevel: 250,
        expCurve: {
            basis: 30,
            extra: 20,
            accelerationA: 30,
            accelerationB: 30
        },
        startingEquipment: [],
    }
}

export default HeroActorPreset;
