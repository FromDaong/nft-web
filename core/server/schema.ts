import { GraphQLDateTime } from "graphql-iso-date";
import {
  asNexusMethod,
  list,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  queryType,
} from "nexus";
export const DateTime = asNexusMethod(GraphQLDateTime, "date");
const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id");
    t.string("name");
    t.nonNull.string("email");
    t.field("emailVerified", { type: DateTime });
    t.field("createdAt", { type: nonNull(DateTime) });
    t.field("updatedAt", { type: nonNull(DateTime) });
    t.field("membership", {
      type: Membership,
      resolve: (parent, _, ctx) => {
        return ctx.prisma.user
          .findUnique({ where: { id: parent.id } })
          .membership();
      },
    });
  },
});

const Membership = objectType({
  name: "Membership",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("userId");
    t.field("user", {
      type: nonNull(User),
      resolve: (parent, _, ctx) => {
        return ctx.prisma.membership
          .findUnique({ where: { id: parent.id } })
          .user();
      },
    });
    t.nonNull.int("orgId");
    t.field("org", {
      type: nonNull(Org),
      resolve: (parent, _, ctx) => {
        return ctx.prisma.membership
          .findUnique({ where: { id: parent.id } })
          .org();
      },
    });
    t.nonNull.string("roleName");
    t.field("role", {
      type: nonNull(Role),
      resolve: (parent, _, ctx) => {
        return ctx.prisma.membership
          .findUnique({ where: { id: parent.id } })
          .role();
      },
    });
  },
});

const Query = objectType({
  name: "Query",
  definition(t) {
    t.field("currentUser", {
      type: User,
      resolve: (root, args, ctx) => {
        return ctx.prisma.user.findUnique({
          where: { email: ctx.currentUserEmail },
        });
      },
    });
  },
});
export const schema = makeSchema({
  types: [User, Membership, Query, DateTime],
});
