


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
      var features = data.features[item.data.type] || {};
      newfeature = {
        "label": item.name,
        "description": item.data.description
      };
      features[item._id] = newfeature;
      actor.update({[`data.features.${item.data.type}`] : features});
      break;
    case "power":
      const newpower = {
        "name": item.name
      }
      for(let [key, value] of Object.entries(item.data)) {newpower[key] = value;}
      switch(newpower.recharge) {
        case "":
          newpower["usage"] = "atwill";
          break;
        case "Short Rest":
          newpower["usage"] = "encounter";
          break;
        case "Long Rest":
        case "Special":
          newpower["usage"] = "daily";
      }
      data.powers[item._id] = newpower;
      actor.update({"data.powers" : data.powers});
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
      var target = Object.keys(delta.data)[0];
      var features = data.features[item.data.type] || {};
      if(target === "type") {
        var oldtype;
        var oldfeatures;
        const featuretypes = ["feat", "competency", "flaw"]

        // go through eleigible lists
        for(let type in featuretypes){
          if(featuretypes[type] === item.data.type) {
            features[item._id] = {
              "label": item.name,
              "description": item.data.description
            }
          }
          else {
            if (data.features[featuretypes[type]][item._id]) {
              oldtype = featuretypes[type];
              oldfeatures = data.features[oldtype] || {};
              delete oldfeatures[item._id];
            }
          }
        }

        actor.update({
          [`data.features.${item.data.type}`] : features,
          [`data.features.${oldtype}`]: oldfeatures
      });
      }
      else {
        features[item._id] = {
          "label": item.name,
          "description": item.data.description
        }
        actor.update({[`data.features.${item.data.type}`] : features});
      }
      break;
    case "power":
      const newpower = {
        "name": item.name
      }
      for(let [key, value] of Object.entries(item.data)) {newpower[key] = value;}
      switch(newpower.recharge) {
        case "":
          newpower["usage"] = "atwill";
          break;
        case "Short Rest":
          newpower["usage"] = "encounter";
          break;
        case "Long Rest":
        case "Special":
          newpower["usage"] = "daily";
      }
      data.powers[item._id] = newpower;
      actor.update({"data.powers" : data.powers});
  }
  actor.update({"data" : data})
});

function _calculatePower(power) {
  return power;
};