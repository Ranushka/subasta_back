"use strict";

/**
 *  payment controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

const tokenPackages = [
  {
    id: "1",
    title: "Demi",
    tokens: 25,
    price: 100,
  },
  {
    id: "2",
    title: "Short",
    tokens: 50,
    price: 130,
  },
  {
    id: "3",
    title: "Venti",
    tokens: 150,
    price: 200,
  },
  {
    id: "4",
    title: "Trenta",
    tokens: 300,
    price: 300,
  },
];

module.exports = createCoreController("api::payment.payment", ({ strapi }) => ({
  async create(ctx) {
    const dataFromUser = ctx.request.body.data;

    const user = ctx.state.user;
    const user_id = user.id;

    console.log("dataFromUser", user_id, dataFromUser.planId);

    const userAccount = await strapi.db.query("api::account.account").findOne({
      where: { user: user_id },
    });

    const selectedPlan = tokenPackages.find(
      (a) => a.id === `${dataFromUser.planId}`
    );
    const balanceToUpdate =
      parseInt(selectedPlan.tokens) + parseInt(userAccount.balance);

    // console.log(
    //   "selectedPlan.tokens-->",
    //   userAccount.balance,
    //   selectedPlan.tokens
    // );

    const updatedAccount = await strapi.entityService.update(
      "api::account.account",
      userAccount.id,
      {
        data: {
          balance: balanceToUpdate,
        },
      }
    );

    ctx.request.body.data.account = userAccount.id;

    const response = await super.create(ctx);

    return {
      ...response,
      balance: updatedAccount.balance,
    };
  },
}));
