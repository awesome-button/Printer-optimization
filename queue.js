module.exports = function Queue() {
    this.queue = [];
    this.enqueue = (item) => {
        this.queue.unshift(item);
    }
    this.dequeue = () => this.queue.pop();
    this.isEmpty = () => this.queue.length === 0;
}
