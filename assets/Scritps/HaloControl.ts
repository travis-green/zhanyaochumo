import { _decorator, Component, Node, Sprite, assetManager, SpriteAtlas } from 'cc';
let enemyhalolist: Array<string> = ['93043', 'a6b9d', 'ecffe', '74ef1', '7d214', 'fea17', 'd7755', 'fe069', '0f466', 'd6710']; // 怪物光环
const { ccclass, property } = _decorator;

@ccclass('HaloControl')
export class HaloControl extends Component {
    start() {
        let sprite = this.getComponent(Sprite);
        let a = 0
        this.schedule(() => {
            if (a < 9) {
                a++
            } else {
                a = 0
            }
            assetManager.loadAny({ uuid: '96de08b3-63c9-4a55-81fc-973352266665@' + enemyhalolist[a], type: SpriteAtlas }, (err, res) => {
                sprite.spriteFrame = res;
            })
        }, 0.1)
    }

    update(deltaTime: number) {

    }
}

