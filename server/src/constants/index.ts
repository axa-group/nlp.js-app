export const decimal = 10;
export const utc = 'UTC';
export const production = 'production';
export const role = {
  guest: 'guest',
  contributor: 'contributor',
  admin: 'admin'
};

export const roleList = Object.keys(role).map(key => role[key]);
export const webhookVerbList = ['get', 'post'];
export const langList = ['es_ES', 'en_US', 'it_IT', 'fr_FR', 'de_DE', 'zh_CN'];
