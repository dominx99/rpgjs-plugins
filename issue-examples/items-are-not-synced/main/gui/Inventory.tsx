import { RpgReactContext } from "@rpgjs/client/react";
import { useContext, useEffect } from "react";

export default function Inventory() {
    const { rpgCurrentPlayer } = useContext(RpgReactContext);

    useEffect(() => {
        const subscription = rpgCurrentPlayer.subscribe(({ object }) => {
            console.log(object.items);
        });

        return () => subscription.unsubscribe();
    }, []);
}
