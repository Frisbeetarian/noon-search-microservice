const { RPCServer } = require("@noon/rabbit-mq-rpc");
const search = require("./search");

const connectionObject = {
  protocol: "amqp",
  hostname: "localhost",
  port: 5672,
  username: "guest",
  password: "guest",
  locale: "en_US",
  vhost: "/",
};

async function establishRPCConsumer() {
  try {
    const rpcServer = new RPCServer({
      connectionObject,
      hostId: "localhost",
      queue: "rpc_queue.noon.search",
      handleMessage: (index, params) => {
        console.log("RPC_SEARCH_RECEIVED", { index, params });
        return search(index, params);
      },
    });

    await rpcServer.start();

    console.log("RPC_CONNECTION_SUCCESSFUL", {
      hostId: "localhost",
      queue: "rpc_queue.noon.search",
    });
  } catch (e) {
    console.log("RPC_CONNECTION_FAILED", JSON.stringify(e));

    setTimeout(() => {
      console.error(e);
      process.exit(1);
    }, 2000);
  }
}

establishRPCConsumer();
