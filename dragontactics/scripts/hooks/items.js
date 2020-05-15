


Hooks.on('createOwnedItem', (actor, item) => {
  const data = actor.data.data;
  switch (item.type) {
    case "class":
      if (data.class._id != "") {actor.deleteOwnedItem(data.class._id)}
      data.class.name = item.name;
      data.class._id = item._id;
      for (let [key, value] of Object.entries(item.data.defense)) {
        data.class.defense[key] = value;
      }
      
      var features = [];
      
      for(let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      actor.update({"data.features.class" : features});
      break;
    case "race":
      if (data.race._id != "") {actor.deleteOwnedItem(data.race._id)}
      data.race.name = item.name;
      data.race._id = item._id;
      
      var features = [];
      
      for(let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      actor.update({"data.features.race" : features});
      break;
    case "feature":
      var features = data.features[item.data.type] || [];
      features.push({
        "_id": item._id,
        "label": item.name,
        "description": item.data.description
      })
      actor.update({[`data.features.${item.data.type}`] : features});
      break;
    // /*
    case "power":
      const newpower = {
        "_id": item._id
      }
      for(let [key, value] of Object.entries(item.data)) {newpower[key] = value;}
      data.powers.push(newpower);
      actor.update({"data.powers" : data.powers});

    /* */
  }
  actor.update({"data" : data})
});

Hooks.on('updateOwnedItem', (actor, item, delta) => {
  function matchID(object) {
    return object["_id"] === item._id;
  }
  const data = actor.data.data;
  switch (item.type) {
    case "class":
      data.class.name = item.name;
      for (let [key, value] of Object.entries(item.data.defense)) {
        data.class.defense[key] = value;
      }
      
      var features = [];
      
      for(let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      actor.update({"data.features.class" : features});
      break;
    case "race":
      data.race.name = item.name;
      
      var features = [];
      
      for(let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      actor.update({"data.features.race" : features});
      break;
    case "feature":
      var target = Object.keys(delta)[0];
      var features = data.features[item.data.type] || [];
      if(target === "type") {
        var oldtype;
        var oldfeatures;
        const featuretypes = ["feat", "competency", "flaw"]

        // find the old list
        for(let type in featuretypes){
          if(type === item.data.type) {
            features.push({
              "_id": item._id,
              "label": item.name,
              "description": item.data.description
            })
          }
          else {
            var index;
            try {
              index = data.features[type].findIndex(matchID);
              if(index != -1) {
                oldtype = type;
                oldfeatures = data.features[oldtype] || [];
                oldfeatures.splice(index, 1)
              }
            }
            catch (e) {
              console.log("Type is empty")
            }
          }
        }
        
        actor.update({
          [`data.features.${item.data.type}`] : features,
          [`data.features.${oldtype}`]: oldfeatures
      });
      }
      else {
        features[features.findIndex(matchID)] = {
          "_id": item._id,
          "label": item.name,
          "description": item.data.description
        }
        actor.update({[`data.features.${item.data.type}`] : features});
      }
      break;
    // /*
    case "power":
      var powers = data.powers;
      powers[powers.findIndex(matchID)][target] = Object.values(delta)[0]
      
    /* */
  }
  actor.update({"data" : data})
});