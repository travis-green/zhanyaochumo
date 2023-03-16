import { _decorator, Script, Label, Component, Node, Prefab, instantiate, director, Collider2D, ICollisionEvent, Contact2DType, assetManager, Sprite, SpriteAtlas } from 'cc';
import { EnemyControl } from './EnemyControl';
const { ccclass, property } = _decorator;
let uuidlist: Array<string> = ['ae37e', '7bed0', 'c7f63', 'fb38d', 'cdb19', 'da686'];
let npclist: Array<string> = ['720de7f9-8261-4819-8802-678bc370c14e', '7f0e291e-bf4f-4c6d-ae3d-d57f4bbf13ab', 'b1fa4cdd-15c3-465c-9214-46d88d8bbf4f', '2afc62e1-ca27-4ed2-8f32-3d17ec905599', '3d1ece16-c3bf-4c51-840c-49fc7afe81dd', '0184e0be-56fc-4be9-937c-4c01490d389d', '76a5def9-b9d0-45dd-af4e-e6ef9c7af611'];
// tag：0主角 1子弹 2敌人 4～5左右增益

@ccclass('PlayerControl')
export class PlayerControl extends Component {
    @property(Prefab)
    bulletPer: Prefab = null;
    @property(Prefab)
    enemyPer: Prefab = null;
    @property(Prefab)
    buffnodeBox: Prefab = null;
    @property(Label)
    injuryFactorCount: Label = null;
    private bulletspeed: number = 0.2;
    public bulletCurrent: number = 0;
    public initLevel: number = 0;
    public levelCount: number = 1;
    public bulletRange: Array<number> = [0];
    public timeClock = null;


    update(deltaTime: number) {

    }

    changeShoot(val) {
        let bpos = this.node.position;
        if (val == 2) {
            return
        }
        for (let i of this.bulletRange) {     // 遍历生成子弹
            //发射
            this.timeClock = this.schedule(() => {       // 攻击 计时器
                let bullet: Node = instantiate(this.bulletPer); // 创建子弹
                bullet.parent = this.node.parent;               // 设置父物体
                bullet.setPosition(                             // 设置子弹位置
                    bpos.x + 20 * i,
                    bpos.y + 100 - 25
                );
            }, this.bulletspeed);
        }
        // if (val == 2) {
        //     this.unschedule(this.timeClock)

        //     return
        // }
        // for (let i of this.bulletRange) {     // 遍历生成子弹
        //     //发射
        //     this.timeClock = this.schedule(() => {       // 攻击 计时器
        //         let bullet: Node = instantiate(this.bulletPer); // 创建子弹
        //         bullet.parent = this.node.parent;               // 设置父物体
        //         bullet.setPosition(                             // 设置子弹位置
        //             bpos.x + 35 * i,
        //             bpos.y + 100 - 25 * Math.abs(i)
        //         );
        //     }, this.bulletspeed);
        // }
        // if (val == 1) {
        //     // 初始
        //     for (let i of this.bulletRange) {     // 遍历生成子弹
        //         //发射
        //         this.timeClock = this.schedule(() => {       // 攻击 计时器
        //             let bullet: Node = instantiate(this.bulletPer); // 创建子弹
        //             bullet.parent = this.node.parent;               // 设置父物体
        //             bullet.setPosition(                             // 设置子弹位置
        //                 bpos.x + 35 * i,
        //                 bpos.y + 100 - 25 * Math.abs(i)
        //             );
        //         }, this.bulletspeed);
        //     }
        // } else {
        //     for (let i of this.bulletRange) {     // 遍历生成子弹
        //         //发射
        //         this.timeClock = this.schedule(() => {       // 攻击 计时器
        //             let bullet: Node = instantiate(this.bulletPer); // 创建子弹
        //             bullet.parent = this.node.parent;               // 设置父物体
        //             bullet.setPosition(                             // 设置子弹位置
        //                 bpos.x + 35 * i,
        //                 bpos.y + 100 - 25 * Math.abs(i)
        //             );
        //         }, this.bulletspeed);
        //     }
        // }


    }

    start() {
        // let by: number;
        this.bulletRange = [-1, 0, 1]
        this.changeShoot(1);
        this.schedule(() => {
            this.runAnimation()
            this.levelCount += 0.5;
        }, 0.6)
        //移动canvas
        this.node.parent.on(Node.EventType.TOUCH_MOVE, (event) => {
            let p = event.getUILocation()
            if (p.x < 40 || p.x > 320) {
                return
            }
            this.node.setWorldPosition(p.x, 120, 0);
        });


        this.schedule(() => {
            // 生成敌人
            let enemyPer: Node = instantiate(this.enemyPer);
            let enemyPerSCript = null;
            enemyPer.parent = this.node.parent;
            var index = Math.floor((Math.random() * npclist.length));

            // assetManager.loadAny({ uuid: npclist[index] || '720de7f9-8261-4819-8802-678bc370c14e', type: SpriteAtlas }, (err, res) => {
            //     enemyPer.getComponent(Sprite).spriteFrame = res;
            // })
            let num = 175 * Math.random() + 1
            let xpos: number = Math.random() >= 0.5 ? -110 : 110;
            let ypos: number = 1400;
            if (Math.random() > 0.5 && xpos) {
                xpos = -xpos
            }
            enemyPer.children[0].getComponent(Label).string = String(Math.floor(this.levelCount) * 8)
            enemyPer.setPosition(xpos, ypos);
            enemyPerSCript = enemyPer.getComponent('EnemyControl');
            enemyPerSCript.Hp = Math.floor(this.levelCount) * 8;
        }, 2)


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
        let sprite = this.getComponent(Sprite);
        if (onBeginConcat.tag === 2) {
            this.node.destroy();
            director.pause()
            // 游戏结束
            return
        }
        // console.log(onBeginConcat.node.removeFromParent)
        if (onBeginConcat.tag === 5 || onBeginConcat.tag === 4) {
            console.log('增益')
            this.initLevel += 1;
            this.injuryFactorCount.getComponent(Label).string = String(this.initLevel)
            // injuryFactor
            // console.log(onBeginConcat.tag)
            // onBeginConcat.node.destroy();
            // this.bulletCurrent += 1;
            // this.unschedule(timeClock)
            // console.log(this.bulletCurrent)
            // for (let index = 0; index < this.bulletCurrent * 2; index++) {
            // const element = array[index];
            // this.bulletRange = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
            // console.log(44444, this.bulletRange)
            // this.bulletRange.shift(index)
            // }
            // this.changeShoot(2);
        }
        // if (onBeginConcat.tag === 3) {
        //     console.log('增益buff无限活力')
        //     onBeginConcat.node.parent.destroy();
        //     this.bulletCurrent += 1;
        //     console.log(this.bulletCurrent)
        //     for (let index = 0; index < this.bulletCurrent * 2; index++) {
        //         // const element = array[index];
        //         this.bulletRange = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
        //         // console.log(44444, this.bulletRange)
        //         // this.bulletRange.shift(index)
        //     }
        //     this.changeShoot(2);
        // }
        // for (let i of [0, 1, 2, 3]) {
        // console.log(234234)
        // console.log(4444, sprite)
        // setTimeout(() => {
        //     assetManager.loadAny({ uuid: 'a1d6bcb7-a7f3-466a-a9b9-48cc509f5092@' + uuidlist[i], type: SpriteAtlas }, (err, res) => {
        //         sprite.spriteFrame = res;
        //     })
        // }, i * 75);
        // }
    }

}
