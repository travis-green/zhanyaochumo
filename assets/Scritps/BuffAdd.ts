import { _decorator, Component, Node, Collider2D, Contact2DType } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BuffAdd')
export class BuffAdd extends Component {
    start() {
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }
    }

    update(deltaTime: number) {

    }

    onBeginContact<BulletControl extends Component>(BEGIN_CONTACT: any, onBeginConcat: any, arg2: this) {
        if (onBeginConcat.tag == 0) {
            // 撞到人物隐藏
            if (BEGIN_CONTACT.tag == 4) {
                // 左
                // cc.director.getCollisionManager()
                this.node.parent.children[1].getComponent(Collider2D).enabled = false
                this.node.parent.children[2].destroy() // 光环销毁
            } else if (BEGIN_CONTACT.tag == 5) {
                this.node.parent.children[0].getComponent(Collider2D).enabled = false
                this.node.parent.children[3].destroy()
            }
            // console.log(this.node.parent)
            BEGIN_CONTACT.node.destroy();
        }
        // let collider = this.getComponent(Collider2D);
        // collider.removeAll(this)
    }
}

