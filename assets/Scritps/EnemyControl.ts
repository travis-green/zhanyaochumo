import { _decorator, Component, Node, Collider2D, UIOpacity, Contact2DType, Label, v3, resources, SpriteAtlas, Sprite, SpriteFrame, assetManager } from 'cc';
const { ccclass, property } = _decorator;
let uuidlist: Array<string> = ['31a11', '4cf43', '5d032', '01ebf', 'cea7e', '6d052', 'c072d', '6318b', 'ceb65'];
let gamescore: number = 0;


@ccclass('EnemyControl')
export class EnemyControl extends Component {
    @property
    private Speed: number = 200;
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
        this.node.setWorldPosition(
            v3(this.node.getWorldPosition().x,
                this.node.getWorldPosition().y - this.Speed * deltaTime)
        );

        if (this.node.position.y < -400) {
            this.node.destroy();    // 敌机超出边框，自动销毁
            gamescore--;
        }
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {                 // 击毁敌机加分
        let str0, str: string;
        // console.log("敌机坠毁   " + "目前得分：" + gamescore);
        // console.log(this.Hp)
        // injuryFactor
        let currentLevel: number = Number(this.node.parent.getChildByName("injuryFactorCount").getComponent(Label).string)
        this.Hp -= (1 + currentLevel);
        let sprite = this.getComponent(Sprite);


        if (this.Hp > 0) {
            // let c = this.Hp -= 2;
            // console.log(c)
            this.node.getComponentInChildren(Label).string = String(this.Hp)

        } else if (this.Hp <= 0) {
            //没血了
            // console.log(1213, this.node.getComponentInChildren(Label))
            // this.node.scale = 0;
            const opacityComp = this.node.getComponentInChildren(UIOpacity);
            opacityComp.opacity = 0;
            selfCollider.destroy();             // 只销毁碰撞体
            this.Speed = 0;                     // 死亡动画结束前，停留在原地
            gamescore++;
            // 延时销毁
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
