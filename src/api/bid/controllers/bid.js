"use strict";

/**
 *  bid controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::bid.bid", ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    const user_id = user.id;

    const { value, product } = ctx.request.body.data;
    const currentBidPrice = parseInt(value);

    const account = await strapi.db.query("api::account.account").findOne({
      where: { user: user_id },
    });

    ctx.request.body.data.account = account.id;

    const lastBid = await strapi.db.query("api::bid.bid").findOne({
      orderBy: { createdAt: "desc" },
      where: { product: product },
    });

    const lastBidPrice = parseInt(lastBid?.value);

    if (lastBidPrice > currentBidPrice) {
      return ctx.badRequest("Bid price less");
    }

    const updatedAccount = await strapi.entityService.update(
      "api::account.account",
      account.id,
      {
        data: {
          balance: account.balance - 1,
        },
      }
    );

    await strapi.entityService.update("api::product.product", product, {
      data: {
        bid_price: currentBidPrice,
      },
    });

    const response = await super.create(ctx);

    return {
      ...response,
      balance: updatedAccount?.balance,
    };
  },
}));
