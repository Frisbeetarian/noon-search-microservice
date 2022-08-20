// import { Client } from "@elastic/elasticsearch";
const { Client } = require("@elastic/elasticsearch");
const rpcClient = require("./client");

let client = new Client({
  node: "http://localhost:9200",
});

async function search(index, params) {
  switch (index) {
    case "INDEX_PROFILE": {
      console.log("index in index profile:", index);
      console.log("params in index profile:", params);

      await client.index({
        index: "profiles",
        body: {
          profile: params.raw[0],
        },
      });
      return null;
    }
    case "SEARCH_FOR_PROFILE": {
      console.log("entered search");
      console.log("index:", index, params);
      const profileUuid = params.profileUuid;

      try {
        // const response = await client.index({
        //   index: "noon-profiles",
        //   body: {
        //     character: "charchaf",
        //     quote: "lezim ye3la2.",
        //   },
        // });

        await client.indices.refresh({ index: "noon-profiles" });

        // Let's search!
        // const result = await client.search({
        //   index: "noon-profiles",
        //   query: {
        //     match: { quote: "lezim ye3la2." },
        //   },
        // });

        const { body } = await client.search({
          index: "noon-profiles",
          body: {
            query: {
              match: { quote: "lezim ye3la2." },
            },
          },
        });

        // console.log(body.hits.hits);

        await rpcClient.returnEsResult().returnProfile(body.hits.hits);

        // console.log('response from es:', response)
        if (body.hits.hits) {
          return body.hits.hits;
        } else return null;
      } catch (e) {
        console.log("error:", e);
      }
    }
    case "SEARCH_FOR_PROFILES": {
      const { profileUuids } = params;
      return null;
    }
    default: {
      return null;
    }
  }
}

module.exports = search;
