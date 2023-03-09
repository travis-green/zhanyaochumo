import { _decorator, Component, Node, Prefab, instantiate, director, Collider2D, ICollisionEvent, Contact2DType, assetManager, Sprite, SpriteAtlas } from 'cc';
import { EnemyControl } from './EnemyControl';
const { ccclass, property } = _decorator;
let uuidlist: Array<string> = ['ae37e', '7bed0', 'c7f63', 'fb38d', 'cdb19', 'da686'];


@ccclass('PlayerControl')
export class PlayerControl extends Component {
    @property(Prefab)
    bulletPer: Prefab = null;
    @property(Prefab)
    enemyPer: Prefab = null;
    @property(Prefab)
    buffnodeBox: Prefab = null;
    private bulletspeed: number = 0.5;


    update(deltaTime: number) {

    }
    start() {
        let bpos = this.node.position;
        let by: number;
        this.schedule(() => {
            this.runAnimation()
        }, 0.6)

        this.node.on(Node.EventType.TOUCH_MOVE, (event) => {
            let p = event.getUILocation()
            this.node.setWorldPosition(p.x, 120, 0);
        });


        for (let i of [-1, 0, 1]) {     // 遍历生成子弹
            //发射
            this.schedule(() => {       // 攻击 计时器
                let bullet: Node = instantiate(this.bulletPer); // 创建子弹
                bullet.parent = this.node.parent;               // 设置父物体
                bullet.setPosition(                             // 设置子弹位置
                    bpos.x + 35 * i,
                    bpos.y + 100 - 25 * Math.abs(i)
                );
            }, this.bulletspeed);
        }

        this.schedule(() => {
            // 生成敌人
            let enemyPer: Node = instantiate(this.enemyPer);
            let num = 175 * Math.random() + 1
            let xpos: number = Math.floor(num);
            let ypos: number = 420 - 100 * Math.random();
            if (Math.random() > 0.5 && xpos) {
                xpos = -xpos
            }
            enemyPer.parent = this.node.parent;
            enemyPer.setPosition(xpos, ypos);
        }, 0.5)


        this.schedule(() => {
            // 生成buff节点
            let buffnodeBox: Node = instantiate(this.buffnodeBox);
            let num = 175 * Math.random() + 1
            let xpos: number = Math.floor(num);
            let ypos: number = 420 - 100 * Math.random();
            if (Math.random() > 0.5 && xpos) {
                xpos = -xpos
            }
            buffnodeBox.parent = this.node.parent;
            buffnodeBox.setPosition(0, ypos);
        }, 5)

        // 开启碰撞检测功能
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    runAnimation() {
        for (let i of [0, 1, 2, 3, 4, 5]) {
            let sprite = this.getComponent(Sprite);
            setTimeout(() => {
                assetManager.loadAny({ uuid: '89d82b27-d57a-4372-bef6-0d7f3b3659e4@' + uuidlist[i], type: SpriteAtlas }, (err, res) => {
                    sprite.spriteFrame = res;
                })
            }, i * 100);
        }
    }

    onBeginContact<BulletControl extends Component>(BEGIN_CONTACT: string, onBeginConcat: any, arg2: this) {
        console.log("我被击中了！");
        let sprite = this.getComponent(Sprite);
        this.node.destroy();
        for (let i of [0, 1, 2, 3]) {
            // console.log(234234)
            // console.log(4444, sprite)
            // setTimeout(() => {
            //     assetManager.loadAny({ uuid: 'a1d6bcb7-a7f3-466a-a9b9-48cc509f5092@' + uuidlist[i], type: SpriteAtlas }, (err, res) => {
            //         sprite.spriteFrame = res;
            //     })
            // }, i * 75);
        }
    }

}
