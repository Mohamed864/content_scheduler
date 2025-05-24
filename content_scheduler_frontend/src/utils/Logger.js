class Logger {
    constructor() {
        this.logs = [];
    }

    log(action, description = "") {
        const log = {
            id: Date.now(),
            time: new Date().toLocaleString(),
            action,
            description,
        };

        this.logs.push(log);
        console.log(`[Logger] ${log.time} - ${log.action}: ${log.description}`);

        // Optional: store in localStorage
        localStorage.setItem("userLogs", JSON.stringify(this.logs));
    }

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

const logger = new Logger();
export default logger;
