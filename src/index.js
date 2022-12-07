"use strict";

// https://github.com/novuhq/blog/blob/main/bidding-app-with-reactnative/server/index.js
// https://novu.co/blog/building-a-real-time-bidding-system-with-socket-io-and-react-native/

let productList = [];

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    // let interval;
    // var io = require("socket.io")(strapi.server.httpServer, {
    //   cors: {
    //     // origin: "http://localhost:8080",
    //     methods: ["GET", "POST"],
    //   },
    // });
    // io.on("connection", (socket) => {
    //   console.log(`⚡: ${socket.id} user just connected!`);
    //   socket.on("addProduct", (product) => {
    //     console.log("======addProduct>>", product);
    //     productList.unshift({
    //       id: product.id,
    //       price: product.price,
    //       owner: product.user,
    //     });
    //     socket.emit("getProducts", productList);
    //   });
    //   socket.on("updatePrice", (data) => {
    //     let result = productList.filter(
    //       (product) => product.id === data.selectedProduct.id
    //     );
    //     result[0].price = data.newPrice;
    //     result[0].owner = data.user;
    //     socket.emit("getProducts", productList);
    //   });
    //   socket.on("disconnect", () => {
    //     socket.disconnect();
    //     console.log("🔥: A user disconnected");
    //   });
    // });
    // io.on("connection", function (socket) {
    //   socket.emit("serverTime", { datetime: new Date().getTime() });
    // });
    /* io.use(async (socket, next) => {
      next();
    }).on("connection", function (socket) {
      if (interval) {
        clearInterval(interval);
      }

      console.log("a user connected", socket.id);
      interval = setInterval(() => {
        // console.log("-----> time");
        io.emit("serverTime", { time: new Date().getTime() }); // This will emit the event to all connected sockets
      }, 2000);

      // socket.on("end", function () {
      //   socket.disconnect(0);
      // });

      socket.on("loadBids", async (params) => {
        // console.log("params.id===>", params);

        let updatedProduct = await strapi
          .service("api::product.product")
          .loadBids(params.id);
        // const bidsList = await strapi.service("api::account.account");
        // .getUserAccount(params.user);

        // console.log("---> loadBids -->", updatedProduct);

        // const products = await strapi
        //   .service("api::product.product")
        //   .loadBids(params.id);

        // io.emit("loadBids", products);
      });

      socket.on("makeBid", async (data) => {
        let params = data;

        console.log("---> params-->", params);
        try {
          let found = await strapi.entityService.findOne(
            "api::product.product",
            params.product,
            { fields: "bid_price" }
          );

          // console.log("---> found-->", found);

          const account = await strapi
            .service("api::account.account")
            .getUserAccount(params.user);

          // console.log("---> account-->", account);

          //Check whether user has enough more to make the bid
          if (parseInt(account.balance) >= parseInt(found.bid_price)) {
            await strapi
              .service("api::bid.bid")
              .makeBid({ ...params, account: account.id });
            let product = await strapi
              .service("api::product.product")
              .findAndUpdateBidPrice(found, params.bidValue);
            let updatedProduct = await strapi
              .service("api::product.product")
              .loadBids(product.id);
            io.emit("loadBids", updatedProduct);
          } else {
            console.log("Balance Is low");
          }
        } catch (error) {
          console.log(error);
        }
      });

      socket.on("disconnect", () => {
        console.log("user disconnected");
        clearInterval(interval);
        socket.disconnect();
      }); 
    });

    strapi.io = io;
    */
  },
};
