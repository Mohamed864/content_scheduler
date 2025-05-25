class Logger {
    constructor() {
        this.logs = [];
    }

    //object needed
    log(action, description = "") {
        const log = {
            id: Date.now(), //unique ID
            time: new Date().toLocaleString(), //readable timestamp
            action,
            description,
        };
        //push object of log in array of logs and set it in localStorage
        this.logs.push(log);
        console.log(`[Logger] ${log.time} - ${log.action}: ${log.description}`);

        localStorage.setItem("userLogs", JSON.stringify(this.logs));
    }

    //if user make an action getlogs related to this action
    getLogs() {
        return this.logs.length > 0
            ? this.logs
            : JSON.parse(localStorage.getItem("userLogs")) || [];
    }

    clearLogs() {
        this.logs = [];
        localStorage.removeItem("userLogs");
    }
}
//export a singleton instance so all components use same logger
const logger = new Logger();
export default logger;
