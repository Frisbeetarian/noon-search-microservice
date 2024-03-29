// import { Client } from "@elastic/elasticsearch";
const { Client } = require("@elastic/elasticsearch");
const rpcClient = require("./client");

let client = new Client({
  node: "http://localhost:9200",
});

async function search(index, params) {
  switch (index) {
    case "INDEX_PROFILE": {
      const profile = params.profile;

      try {
        const body = await client.index({
          index: "profiles",
          id: profile.uuid,
          document: {
            profile: params.profile.raw[0],
          },
        });

        console.log("body", body);
      } catch (e) {
        console.log("error:", e);
      }

      break;
    }
    case "UPDATE_PROFILE": {
      try {
        await client.update({
          index: "profiles",
          id: params.senderUuid,
          body: {
            friendshipRequests: [params.recipientProfile],
          },
        });
      } catch (e) {
        console.log("error:", e);
      }

      break;
    }
    case "SEARCH_FOR_PROFILE_BY_USERNAME": {
      const username = params.username;
      const senderUuid = params.senderUuid;
      console.log("username", username);
      try {
        const response = await client.search({
          query: {
            prefix: { "profile.username": username },
          },
        });

        console.log("response", response);
        if (response.hits && response.hits.hits.length > 0) {
          const profiles = response.hits.hits.map((hit) => hit._source.profile);
          await rpcClient.returnEsResult().returnProfile(profiles, senderUuid);
        } else {
          await rpcClient.returnEsResult().returnProfile([], senderUuid);
        }
      } catch (e) {
        console.log("error:", e);
      }

      break;
    }
    case "SEARCH_FOR_PROFILE": {
      const profileUuid = params.profileUuid;

      try {
        const { body } = await client.search({
          index: "profiles",
          body: {
            query: {
              match: { "profile.uuid": profileUuid },
            },
          },
        });

        console.log("search results:", body.hits.hits[0]._source.profile);

        await rpcClient
          .returnEsResult()
          .returnProfile(body.hits.hits[0]._source.profile);

        // console.log('response from es:', response)
        if (body.hits.hits) {
          return body.hits.hits[0]._source.profile;
        } else return null;
      } catch (e) {
        console.log("error:", e);
      }

      break;
    }
    case "SEARCH_FOR_PROFILES": {
      const { profileUuids } = params;
      break;
    }
    default: {
      return null;
    }
  }
}

module.exports = search;
