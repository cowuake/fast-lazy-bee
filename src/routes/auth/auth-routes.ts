import type { FastifyInstance, RouteOptions } from 'fastify';
import type { UserSchemaType } from '../../schemas/auth/data';
import { LoginSchema, RegisterSchema } from '../../schemas/auth/http';
import { HttpMethods, HttpStatusCodes, RouteTags } from '../../utils/constants/enums';
import { genOptionsRoute } from '../../utils/routing-utils';

const routes: RouteOptions[] = [
  {
    method: [HttpMethods.POST],
    url: '/login',
    schema: LoginSchema,
    handler: async function login(request, reply) {
      const { email, password } = request.body as UserSchemaType;
      const user = (await this.dataStore.checkUser(email, password)) as UserSchemaType;
      const token = this.jwt.sign(user, { expiresIn: '1h' });
      reply.code(HttpStatusCodes.OK).send({ token });
    }
  },
  {
    method: [HttpMethods.POST],
    url: '/register',
    schema: RegisterSchema,
    handler: async function register(request, reply) {
      const user = request.body as UserSchemaType;
      await this.dataStore.registerUser(user);
      reply.code(HttpStatusCodes.Created).send();
    }
  }
];

const authRoutes = async (fastify: FastifyInstance): Promise<void> => {
  const optionsRoutes = ['/login', '/register'].map((url) =>
    genOptionsRoute(url, [RouteTags.Auth], `${HttpMethods.OPTIONS}, ${HttpMethods.POST}`)
  );

  [...optionsRoutes, ...routes].forEach((route) => {
    fastify.route(route);
  });
};

export default authRoutes;
