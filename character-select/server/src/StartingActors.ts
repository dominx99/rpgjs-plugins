type ActorClass = { new(...args: any[]) }

export default class StartingActors {
    static instantiateActorDecorators = (decorators: ActorClass[]) => {
        const objects = {};
        decorators.forEach((decorator) => {
            const obj = new decorator();
            const classObj = new obj.class();
            objects[obj.id] = {
                id: obj.id,
                name: obj.name,
                description: obj.description,
                class: {
                    graphics: classObj.graphics,
                    name: classObj.name,
                },
            };
        });
        return objects;
    }
}
