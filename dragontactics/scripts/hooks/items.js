


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
  // console.log("Updating an item")
  // console.log(actor);
  // console.log(item)
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
      var features = data.features[item.data.type] || [];
      features[features.findIndex(matchID)][Object.keys(delta)[0]] = Object.values(delta)[0]
      // for(let i of features){
      //   if(i._id === delta._id){
      //     i[Object.keys(delta)[0]] = delta[Object.keys(delta)[0]]
      //     // try {i.name=delta.name;} catch (e) {console.log("Delta did not have a name")}
      //     // try {i.description=delta.description} catch (e) {console.log("Delta did not have a description")}
      //   }
      // }
      actor.update({[`data.features.${item.data.type}`] : features});
      break;
    // /*
    case "power":
      var powers = data.powers;
      powers[powers.findIndex(matchID)][Object.keys(delta)[0]] = Object.values(delta)[0]
      
    /* */
  }
  actor.update({"data" : data})
});