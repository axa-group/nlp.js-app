import * as path from 'path';

export const defaultStatus = 'dumb';
export const status = {
  dumb: 'dumb',
  ready: 'ready',
  training: 'training',
  default: defaultStatus
};
export const modelsPath = process.env.MODELS_PATH ||  path.join(__dirname, '..','..','..', '..', '..', 'nlp-models');
