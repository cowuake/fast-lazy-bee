import type { FastifyInstance, RouteOptions } from 'fastify';
import { LoginSchema } from '../../../schemas/auth/http';
import type { UserSchemaType } from '../../../schemas/users/data';
import { HttpMethods, HttpStatusCodes, RouteTags } from '../../../utils/constants/enums';
import { registerEndpointRoutes } from '../../../utils/routing-utils';

const endpoint = '';
const tags: RouteTags[] = [RouteTags.Auth] as const;

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.POST],
    url: endpoint,
    schema: { ...LoginSchema, tags },
    handler: async function login(request, reply) {
      const { email, password } = request.body as UserSchemaType;
      const user = (await this.dataStore.checkUser(email, password)) as UserSchemaType;
      const token = this.jwt.sign(user, { expiresIn: '1h' });
      reply.code(HttpStatusCodes.OK).send({ token });
    }
  } as const
] as const;

const authRoutes = async (fastify: FastifyInstance): Promise<void> => {
  await registerEndpointRoutes(fastify, endpoint, routes);
};

export default authRoutes;
