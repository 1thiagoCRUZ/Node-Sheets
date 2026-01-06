import cron from 'node-cron';

export function schedule(job) {
  // isso aqui define o tempo que vai rodar o job se for /15 vai rodar a cada 15 min
  cron.schedule('*/1 * * * *', job);
}
