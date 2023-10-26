type ActorClass = { new(...args: any[]) }

export default class StartingActors {
    static instantiateActorDecorators = (decorators: ActorClass[]) => {
        const objects = {};
        decorators.forEach((decorator) => {
            const actorObj = new decorator();
            const classObj = {};

            Object.entries(actorObj.class.prototype).forEach(([key, value]) => {
                classObj[key] = value;
            })

            delete classObj.toJSON;

            objects[actorObj.id] = {
                id: actorObj.id,
                name: actorObj.name,
                description: actorObj.description,
                class: classObj,
            };
        });

        return objects;
    }
}
