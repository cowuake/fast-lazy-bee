import { type Static, Type } from '@sinclair/typebox';
import { TestConstants } from '../../utils/constants/constants';
import { EmailSchema, StringSchema } from '../data';

const UserSchema = Type.Object({
  name: Type.Optional({ ...StringSchema, examples: [TestConstants.userName] }),
  email: { ...EmailSchema, examples: [TestConstants.userEmail] },
  password: { ...StringSchema, examples: [TestConstants.userPassword] }
});

type UserSchemaType = Static<typeof UserSchema>;

export { UserSchema, type UserSchemaType };
