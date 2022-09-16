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
      console.log("params in index profile:", params.profile);
      const profile = params.profile;

      try {
        await client.index({
          index: "profiles",
          id: profile.uuid,
          body: {
            profile: params.profile.raw[0],
          },
        });
      } catch (e) {
        console.log("error:", e);
      }

      return null;
    }
    case "UPDATE_PROFILE": {
      console.log("index in update profile:", index);
      console.log("index in update profile:", params.index);
      console.log("uuid in update profile:", params.senderUuid);
      console.log(
        "recipient profile in update profile:",
        params.recipientProfile
      );

      try {
        // const document = await client.get({
        //   index: "profiles",
        //   id: params.uuid,
        // });

        await client.update({
          index: "profiles",
          id: params.senderUuid,
          body: {
            friendshipRequests: [params.recipientProfile],
          },
        });

        // console.log("profile in update profile:", document);

        // await client.update({
        //   index: "profiles",
        //
        //   body: {
        //     profile,
        //   },
        // });
      } catch (e) {
        console.log("error:", e);
      }

      return null;
    }
    case "SEARCH_FOR_PROFILE_BY_USERNAME": {
      const username = params.username;
      console.log("username in search for profile by username", username);

      try {
        const { body } = await client.search({
          index: "profiles",
          body: {
            query: {
              match: { "profile.username": username },
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

        // await client.indices.refresh({ index: "profiles" });

        // Let's search!
        // const result = await client.search({
        //   index: "noon-profiles",
        //   query: {
        //     match: { quote: "lezim ye3la2." },
        //   },
        // });

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
