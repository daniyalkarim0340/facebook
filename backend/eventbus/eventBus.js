import { EventEmitter } from "events";


class EventBus extends EventEmitter {
    emit(event, payload) {
        super.emit(event, payload);
    }
}
const eventBus = new EventBus();

export default eventBus;