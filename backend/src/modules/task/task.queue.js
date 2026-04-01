import Queue from "bull";
import configs from "../../config/env.config.js"

const { REDIS_QUEUE_DB, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = configs;


const taskQueue = new Queue("task-queue", {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    db: REDIS_QUEUE_DB
  },
});

export default taskQueue;
