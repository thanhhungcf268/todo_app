import taskQueue from "./task.queue";

taskQueue.process(async (job) => {
  const { task } = job.data;

  console.log("Processing task:", task.title);

  // giả lập xử lý
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("Done task:", task.title);
});