import { _decorator, Component, Node, Sprite, SpriteAtlas, assetManager } from 'cc';
const { ccclass, property } = _decorator;
let buffnode: Array<string> = ['bc120', '445a5', 'a3c2d', '97842', 'a7b72', '9130e', '91945', '36690']; // 怪物光环
let buffrightnode: Array<string> = ['f4588', 'e926f', 'c1974', '5f8d2', 'b3098', '33dc7', '72977', '700db']; // 怪物光环
let buffnodehalo: Array<string> = ['93043', 'a6b9d', 'ecffe', '74ef1', '7d214', 'fea17', 'd7755', 'fe069', '0f466', 'd6710']; // 物品光环


@ccclass('BuffItemControl')
export class BuffItemControl extends Component {
    start() {
        let randomIndex = Math.random()
        if (randomIndex <= 0.5) {
            this.runAnimation(0, buffnode.length - 1, '2416b05a-cce0-41da-a65d-b71f314bde3e@', buffnode)
            this.runAnimation(1, buffrightnode.length - 1, '195d2f62-163e-46b6-8e40-9a34f64c0945@', buffrightnode)
            this.runAnimation(2, buffnodehalo.length - 1, 'c5737b35-aa5a-41f3-bb9b-ef9f55e0b1b3@', buffnodehalo)
            this.runAnimation(3, buffnodehalo.length - 1, 'c5737b35-aa5a-41f3-bb9b-ef9f55e0b1b3@', buffnodehalo)
        } else {
            this.runAnimation(1, buffnode.length - 1, '2416b05a-cce0-41da-a65d-b71f314bde3e@', buffnode)
            this.runAnimation(0, buffrightnode.length - 1, '195d2f62-163e-46b6-8e40-9a34f64c0945@', buffrightnode)
            this.runAnimation(2, buffnodehalo.length - 1, 'c5737b35-aa5a-41f3-bb9b-ef9f55e0b1b3@', buffnodehalo)
            this.runAnimation(3, buffnodehalo.length - 1, 'c5737b35-aa5a-41f3-bb9b-ef9f55e0b1b3@', buffnodehalo)
        }
    }

    runAnimation(nodeindex, picarr, picbase, imagelist) {
        let leftsprite = this.node.children[nodeindex].getComponent(Sprite);
        let a = 0
        this.schedule(() => {
            if (a < picarr) {
                a++
            } else {
                a = 0
            }
            assetManager.loadAny({ uuid: picbase + imagelist[a], type: SpriteAtlas }, (err, res) => {
                leftsprite.spriteFrame = res;
            })
        }, 0.05)
    }

    update(deltaTime: number) {

    }
}

