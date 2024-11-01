import crypto from 'crypto';

const hashValue = (value: string): string => crypto.createHash('md5').update(value).digest('hex');

export { hashValue };
