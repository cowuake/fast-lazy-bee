import { type Static, Type } from '@sinclair/typebox';
import { TestConstants } from '../../utils/constants/constants';
import { EmailSchema, StringSchema } from '../data';

const UserSchema = Type.Object({
  name: Type.Optional({ ...StringSchema, examples: [TestConstants.userName] }),
  email: { ...EmailSchema, examples: [TestConstants.userEmail] },
  password: { ...StringSchema, examples: [TestConstants.userPassword] }
});

const JwtSchema = Type.Object({
  token: StringSchema
});

type UserSchemaType = Static<typeof UserSchema>;
type JwtSchemaType = Static<typeof JwtSchema>;

export { JwtSchema, UserSchema, type JwtSchemaType, type UserSchemaType };
