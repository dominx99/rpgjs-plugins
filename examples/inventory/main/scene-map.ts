import { RpgSceneMapHooks, RpgSceneMap } from '@rpgjs/client'

const sceneMap: RpgSceneMapHooks = {
    onAfterLoading(scene: RpgSceneMap) {
        scene.viewport?.setZoom(1.4);
    }
}

export default sceneMap;
