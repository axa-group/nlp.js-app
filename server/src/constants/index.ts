export const decimal = 10;
export const utc = 'UTC';
export const production = 'production';
export const role = {
  guest: 'guest',
  contributor: 'contributor',
  admin: 'admin'
};

export const roleList = Object.keys(role).map(key => role[key]);
