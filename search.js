function search(index, params) {
  switch (index) {
    case "SEARCH_FOR_PROFILE": {
      console.log("entered search");
      console.log("index:", index, params);
      const profileUuid = params.profileUuid;
      if (!profileUuid) {
        // return errors(task, paramData).invalidParams();
        return null;
      }

      return null;
    }
    case "SEARCH_FOR_PROFILES": {
      const { profileUuids } = params;
      return null;
    }
    default: {
      return errors(task, params).invalidTask();
    }
  }
}

module.exports = search;
