import { _decorator, Script, UIOpacity, SpriteFrame, resources, Label, Component, Node, Prefab, instantiate, director, Collider2D, ICollisionEvent, Contact2DType, assetManager, Sprite, SpriteAtlas, Scheduler } from 'cc';
import { EnemyControl } from './EnemyControl';
const { ccclass, property } = _decorator;
let uuidlist: Array<string> = ['ae37e', '7bed0', 'c7f63', 'fb38d', 'cdb19', 'da686'];
let npclist: Array<string> = ['1', '2', '3', '4', '5', '6', '7'];
let levelup1: Array<string> = ['2f41a', '7a232', '18485', '0cda5', 'a6c49', '656a6', '07429', '80fe3', '54878', 'ba987', '2fc59', 'ed7eb', 'e2c9b', 'c7ad5', '52c42', '8fa1e', 'a0870', 'f3508', '2313e', '4f3ca', 'dc0bd', '85e40', '29e0e', '706e2', '3d33a', '3fc89', '8a581', '93d1c', '72a05', '22b56', '5c7bb', 'a9817', '4a939', '3879b', '17ed2', 'daa6e', '7f2cc', 'dcb3e', '80ca5', 'b86ff', 'ea784'];
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
    private bulletspeed: number = 0.3;
    public bulletCurrent: number = 0;
    public initLevel: number = 0;
    public levelCount: number = 1;
    public bulletRange: Array<number> = [0];
    public timeClock = null;
    public shootstatus = 0;


    update(deltaTime: number) {

    }

    startShoot() {
        let bpos = this.node.position;
        for (let i of this.bulletRange) {     // 遍历生成子弹
            //发射
            let bullet: Node = instantiate(this.bulletPer); // 创建子弹
            bullet.parent = this.node.parent;               // 设置父物体
            bullet.setPosition(                             // 设置子弹位置
                bpos.x + 20 * i,
                bpos.y + 100 - 25
            );
        }
    }

    changeShoot() {
        this.timeClock = function () {
            if (this.shootstatus == 1) {
                this.unschedule(this.timeClock);
            }
            this.startShoot();
        }
        this.schedule(this.timeClock, this.bulletspeed);
    }

    start() {
        const myArray = this.generateArray(1);
        // let by: number;
        this.bulletRange = myArray
        this.shootstatus = 0;
        // setTimeout(() => {
        //     this.shootstatus = 1
        // }, 5000);
        // setTimeout(() => {
        //     this.bulletRange = [0];
        //     this.shootstatus = 0
        //     this.schedule(this.timeClock, this.bulletspeed);
        // }, 9000);
        this.changeShoot();
        // setTimeout(() => {
        //     this.unschedule(this.timeClock);
        // }, 5000);
        this.schedule(() => {
            this.runAnimation()
            this.levelCount += 0.5;
        }, 0.6)
        //移动canvas
        this.node.parent.on(Node.EventType.TOUCH_MOVE, (event) => {
            let p = event.getUILocation()
            if (p.x < 40 || p.x > 335) {
                return
            }
            this.node.setWorldPosition(p.x, 120, 0);
        });


        this.schedule(() => {
            // console.log('生成敌人')
            let enemyPer: Node = instantiate(this.enemyPer);
            let enemyPerSCript = null;
            enemyPer.setScale(0.5, 0.5)
            enemyPer.parent = this.node.parent;
            var index = Math.floor((Math.random() * npclist.length));
            resources.load(`npc/npc_00${npclist[index]}/spriteFrame`, SpriteFrame, (err, asset) => {
                enemyPer.getComponent(Sprite).spriteFrame = asset;
            });
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
        }, 5)


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
        }, 10)

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

    generateArray(length) {
        const arr = [];
        const mid = Math.floor(length / 2); // 中间位置
        for (let i = 1; i <= mid; i++) {
            arr[mid + i] = i; // 正数
            arr[mid - i] = -i; // 负数
        }
        if (length % 2 !== 0) {
            arr[mid] = 0; // 中间位置为0
        }
        return arr;
    }




    onBeginContact<BulletControl extends Component>(BEGIN_CONTACT: string, onBeginConcat: any, arg2: this) {
        // let sprite = this.node.getComponent(Sprite);
        let playrolesprite = this.node.children[0].getComponent(Sprite);
        if (onBeginConcat.tag === 2) {
            this.node.destroy();
            director.pause()
            // 游戏结束
            return
        }
        if (onBeginConcat.tag === 5 || onBeginConcat.tag === 4) {
            this.node.children[0].getComponent(UIOpacity).opacity = 255
            this.initLevel += 1;
            this.injuryFactorCount.getComponent(Label).string = String(this.initLevel)
            // 升级动画
            // console.log('增益')
            // this.bulletRange = [-1, 0, 1];
            let bulletRange = this.generateArray(3);
            // let by: number;
            this.bulletRange = bulletRange
            this.shootstatus = 0;
            // this.shootstatus = 0
            //     this.schedule(this.timeClock, this.bulletspeed);
            for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]) {
                setTimeout(() => {
                    assetManager.loadAny({ uuid: '6be8e441-9237-455b-9097-0e5715759d63@' + levelup1[i], type: SpriteAtlas }, (err, res) => {
                        playrolesprite.spriteFrame = res;
                    })
                }, i * 30);
            }
            setTimeout(() => {
                this.node.children[0].getComponent(UIOpacity).opacity = 0
            }, 1230);
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
