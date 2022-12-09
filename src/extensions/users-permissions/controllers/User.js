const _ = require("lodash");
const { sanitizeEntity } = require("strapi-utils");

const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model,
  });

module.exports = {
  async create(ctx) {
    const response = await super.create(ctx);

    console.log("response-create-->", response);

    // const updatedAccount = await strapi.entityService.update(
    //   "api::account.account",
    //   accountId,
    //   {
    //     data: {
    //       balance: 10,
    //     },
    //   }
    // );

    return {
      ...response,
      balance: updatedAccount?.balance,
    };
  },
  async me(ctx) {
    const user = ctx.state.user;

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
