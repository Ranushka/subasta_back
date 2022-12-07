const { sanitizeEntity } = require("strapi-utils");

const sanitizeUser = (user) =>
  sanitizeEntity(user, {
    model: strapi.query("user", "users-permissions").model,
  });

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
        balance: account.balance,
        account: account.id,
      },
    });
  },
};
