import type { FastifyInstance, RouteOptions } from 'fastify';
import type { UserSchemaType } from '../../schemas/users/data';
import { CreateUserSchema } from '../../schemas/users/http';
import { HttpMethods, HttpStatusCodes, RouteTags } from '../../utils/constants/enums';
import { registerEndpointRoutes } from '../../utils/routing-utils';

const endpoint = '';
const tags: RouteTags[] = [RouteTags.Users] as const;

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.POST],
    url: endpoint,
    schema: { ...CreateUserSchema, tags: [...tags, RouteTags.Auth] },
    handler: async function register(request, reply) {
      const user = request.body as UserSchemaType;
      await this.dataStore.registerUser(user);
      reply.code(HttpStatusCodes.Created).send();
    }
  } as const
] as const;

const usersRoutes = async (fastify: FastifyInstance): Promise<void> => {
  await registerEndpointRoutes(fastify, endpoint, routes);
};

export default usersRoutes;
