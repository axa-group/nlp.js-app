const { NlpManager } = require('node-nlp');

process.on('message', async json => {
  const manager = new NlpManager({ useLRC: true, useNeural: false });
  manager.import(json);
  manager.settings.useNeural = false;
  await manager.train();
  process.send(manager.export());
});
