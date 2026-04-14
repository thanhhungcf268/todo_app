import Queue from "bull";
import configs from "../../config/env.config.js";
import { redisConfig } from "../../config/redis.js";

const { REDIS_QUEUE_DB } = configs;

const taskQueue = new Queue("task:queue", {
  redis: {
    ...redisConfig,
    db: REDIS_QUEUE_DB,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

taskQueue.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

taskQueue.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});

export default taskQueue;
