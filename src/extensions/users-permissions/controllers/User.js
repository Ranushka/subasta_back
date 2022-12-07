const _ = require("lodash");
const { sanitizeEntity } = require("strapi-utils");

const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model,
  });

const formatError = (error) => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];

module.exports = {
  async me(ctx) {
    const user = ctx.state.user;

    console.log("-------->>>>>>", user);

    if (!user) {
      return ctx.badRequest(null, [
        { messages: [{ id: "No authorization header was found" }] },
      ]);
    }

    const account = await strapi
      .service("api::account.account")
      .getUserAccount(user.id);

    // const userQuery = await strapi.query("user", "users-permissions");
    // const userWithMedia = await userQuery.findOne({ id: ctx.state.user.id });

    ctx.send({
      // jwt: getService("jwt").issue({ id: user.id }),
      user: {
        ...(await sanitizeUser(user, ctx)),
        balance: account?.balance,
        account: account?.id,
      },
    });
  },
  /**
   * Retrieve user records.
   * @return {Object|Array}
   */
  async find(ctx, next, { populate } = {}) {
    let users;

    console.log("-------->>>>>>", user);

    ctx.set(
      "Content-Range",
      await strapi.query("user", "users-permissions").count({})
    );
    if (_.has(ctx.query, "_q")) {
      // use core strapi query to search for users
      users = await strapi
        .query("user", "users-permissions")
        .search(ctx.query, populate);
    } else {
      users = await strapi.plugins["users-permissions"].services.user.fetchAll(
        ctx.query,
        populate
      );
    }

    const data = users.map(sanitizeUser);
    ctx.send(data);
  },
};
