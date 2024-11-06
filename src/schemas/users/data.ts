import { type Static, Type } from '@sinclair/typebox';
import { TEST } from '../../utils/constants/constants';
import { EmailSchema, StringSchema } from '../data';

const UserSchema = Type.Object({
  name: Type.Optional({ ...StringSchema, examples: [TEST.USER_NAME] }),
  email: { ...EmailSchema, examples: [TEST.USER_EMAIL] },
  password: { ...StringSchema, examples: [TEST.USER_PASSWORD] }
});

type UserSchemaType = Static<typeof UserSchema>;

export { UserSchema, type UserSchemaType };
