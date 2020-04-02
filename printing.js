let Queue = require('./queue.js');

function Printer(ppm) {
    this.currTask = null;
    this.remTime = 0;
    this.rate = ppm;
    this.busy = () => this.currTask !== null;
    this.takeNext = (task) => {
        this.currTask = task;
        this.remTime = task.getPages/this.rate*60;
    }
    this.tick = () => {
        if (this.currTask) {
            this.remTime = this.remTime - 1;
            if (this.remTime === 0) this.currTask = null;
        }
    }
}

function Task(time) {
    this.getPages = Math.floor(Math.random()*20)+1; //the same task gets a different amount of pages
    this.timeStamp = time;
    this.waitTime = (currTime) => currTime - this.timeStamp;
}

function simulation(testTime, ppm, secPerTask) {
    let waitTimes = [];
    let tasksLeft = [];

    for (let i = 0; i < 10; i++) {

        let p = new Printer(ppm);
        let q = new Queue();
        let waitTimeTask = [];

        for (let i = 0; i < testTime - 1; i++) {
            let currSec = i;
            if (newTaskCreated(secPerTask)) {
                let t = new Task(currSec);
                q.enqueue(t);
            }
            if (!p.busy() && !q.isEmpty()) {
                let nextTask = q.dequeue();
                p.takeNext(nextTask);
                let waited = nextTask.waitTime(currSec);
                waitTimeTask.push(waited);
            }
            p.tick();
        }
        tasksLeft.push(q.queue.length);
        let sumTimes = waitTimeTask.reduce((count, curr) => count + curr);
        let averageTimes = Math.round(sumTimes/waitTimeTask.length);
        waitTimes.push(averageTimes);
    };
    calcAverage(waitTimes, tasksLeft);  
}

function newTaskCreated(oneTaskPeriod) {
    let rand = Math.floor(Math.random()*oneTaskPeriod)+1;
    return rand === oneTaskPeriod;
}

function calcAverage(waitTimes, tasksLeft) {
    let sumTimes = waitTimes.reduce((count, curr) => count + curr);
    let sumTasks = tasksLeft.reduce((count, curr) => count + curr);
    let averageWaiting = Math.round(sumTimes / waitTimes.length);
    let averageTasksLeft = Math.round(sumTasks / tasksLeft.length);
    console.log(`The average waiting time, as observed during the period of 1 hour, with 10 attempts: ${averageWaiting} seconds.\nTasks left in the queue: ${averageTasksLeft}`);
}


simulation(3600, 5, 180);
simulation(3600, 10, 180);
simulation(3600, 15, 180);

//testTime - usually testing within 1 hour(3600 sec);
//Pages per minutes - it is printer's capacity;
//Seconds per task - means how often printer will usually receive tasks within 1 hour.
//In this simulation, it is every 180th second or every three minutes. It means that
// within 1 hour printer will usually receive about 20 tasks(3600 / 180).

//Simulation results:
// For an office of 10 employees, calculated as if each employee would print twice per hour.
//Tasks are max 20 pages long.

//Printer's capacity 5 pages/min: Waiting time: 100-170 seconds, with 1-2 tasks left in the queue.
//Printer's capacity 10 pages/min: Waiting time: 14-22 seconds, with 0 tasks left in the queue.
//Printer's capacity 15 pages/min: Waiting time: 6-8 seconds, with 0 tasks left in the queue.