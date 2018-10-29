const { NlpManager } = require('node-nlp');

process.on('message', async json => {
  const manager = new NlpManager();
  manager.import(json);
  await manager.train();
  process.send(manager.export());
});
