import { _decorator, Component, Node, Collider2D, UIOpacity, Contact2DType, Label, v3, resources, SpriteAtlas, Sprite, SpriteFrame, assetManager } from 'cc';
const { ccclass, property } = _decorator;
let uuidlist: Array<string> = ['31a11', '4cf43', '5d032', '01ebf', 'cea7e', '6d052', 'c072d', '6318b', 'ceb65'];
let attacklist: Array<string> = ['5d068', '1b7b1', '3e24d', '75a99', 'c7738']; // 怪物光环
let gamescore: number = 0;


@ccclass('EnemyControl')
export class EnemyControl extends Component {
    @property
    private Speed: number = 140;
    @property(Number)
    private Hp: number = 8;
    // public Hp: Node;
    start() {
        let collider = this.getComponent(Collider2D);

        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    update(deltaTime: number) {
        // 140 为和背景相同速度
        this.node.setWorldPosition(
            v3(this.node.getWorldPosition().x,
                this.node.getWorldPosition().y - 140 * deltaTime)
        );
        if (this.node.position.y < -400) {
            this.node.destroy();    // 敌机超出边框，自动销毁
            gamescore--;
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {                 // 击毁敌机加分
        let str0, str: string;
        // injuryFactor
        let currentLevel: number = Number(this.node.parent.getChildByName("injuryFactorCount").getComponent(Label).string)
        this.Hp -= (1 + currentLevel);
        let sprite = this.getComponent(Sprite);
        let attactAni = this.node.children[2].getComponent(Sprite)

        if (this.Hp > 0) {
            // 怪物受击
            // let c = this.Hp -= 2;
            this.node.getComponentInChildren(Label).string = String(this.Hp)
            // 受击动画
            for (let i of [0, 1, 2, 3, 4]) {
                setTimeout(() => {
                    assetManager.loadAny({ uuid: '082913be-e5fd-4ed0-aac8-38f36a3065ef@' + attacklist[i], type: SpriteAtlas }, (err, res) => {
                        attactAni.spriteFrame = res;
                    })
                }, i * 10);
            }
        } else if (this.Hp <= 0) {
            //没血了
            // console.log(1213, this.node.getComponentInChildren(Label))
            // this.node.scale = 0;
            try {
                wx.vibrateLong()
            } catch (error) {

            }
            const opacityComp = this.node.getComponentInChildren(UIOpacity);
            opacityComp.opacity = 0;
            this.node.children[1].destroy();
            selfCollider.destroy();             // 只销毁碰撞体
            this.Speed = 0;                     // 死亡动画结束前，停留在原地
            gamescore++;
            // 销毁动画
            for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
                setTimeout(() => {
                    assetManager.loadAny({ uuid: '354aa36e-fdf9-4065-9e4e-d9eab282fdce@' + uuidlist[i], type: SpriteAtlas }, (err, res) => {
                        sprite.spriteFrame = res;
                    })
                }, i * 100);
            }
            setTimeout(() => {
                this.die();
            }, 900)
        }
    }

    die() {
        try {
            // 遍历加载爆炸图片

            this.node.destroy();
        } catch (err) {
            console.log(err);
        }
    }
}
