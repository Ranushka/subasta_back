"use strict";

/**
 *  product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  async update(ctx) {
    const response = await super.update(ctx);

    return response;
  },

  async find(ctx) {
    const { data, meta } = await super.find(ctx);

    if (data) {
      const nowTime = Date.now();

      data.map((item) => {
        const endTime = Date.parse(item.attributes.auction_end);
        const timeDeference = endTime - nowTime;

        item.attributes.timeLeft = timeDeference;
      });
    }

    return { data, meta };
  },
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi
      .service("api::product.product")
      .findOne(id, query);

    if (!entity) {
      return;
    }

    const bidsList = await strapi.service("api::bid.bid").find(
      {
        filters: { product: id },
        sort: "createdAt:desc",
        populate: {
          account: {
            populate: { user: true },
          },
        },
      },
      query
    );

    bidsList.results.map((bidItem) => {
      bidItem.username = bidItem.account.user.username;
      bidItem.accountId = bidItem.account.id;
      delete bidItem.account;
    });

    const nowTime = Date.now();
    const endTime = Date.parse(entity.auction_end);
    const timeDeference = endTime - nowTime;

    entity.bids = bidsList?.results || [];
    entity.timeLeft = timeDeference;

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));
