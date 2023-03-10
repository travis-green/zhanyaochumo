import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StepCount')
export class StepCount extends Component {
    public stepCount: number = 0
    start() {
        this.schedule(() => {
            this.getComponent(Label).string = `微信步数:${this.stepCount++}`
        }, 0.2)
    }

    update(deltaTime: number) {

    }
}
