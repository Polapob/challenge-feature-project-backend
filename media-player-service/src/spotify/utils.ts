import { stringify } from 'qs';

export const generateRandomString = (length: number) => {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const charLength = chars.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
};

export const createURLWithQuery = (
  url: string,
  queryObject: Record<string, string>,
) => {
  return url + stringify(queryObject);
};
