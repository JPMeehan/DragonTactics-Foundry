Hooks.on('createOwnedItem', (actor, item) => {
  console.log("Creating an Item")
  switch (item.type) {
    case "class":
      var cls = actor.data.data.class;
      if (cls._id != "") {actor.deleteOwnedItem(cls._id)}
      cls.name = item.name;
      cls._id = item._id;
      for (let [key, value] of Object.entries(item.data.defense)) {
        cls.defense[key] = value;
      }
      var features = [];
      
      for(let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      actor.data.data.features.class = [...features];
      break;
    case "race":
      var race = actor.data.data.race;
      if (race._id != "") {actor.deleteOwnedItem(race._id)}
      race.name = item.name;
      race._id = item._id;
      var features = [];
      
      for(let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      actor.data.data.features.race = [...features];
      break;
  }
});

Hooks.on('updateOwnedItem', (actor, item) => {
  // console.log("Updating an item")
  // console.log(actor);
  // console.log(item)
  switch (item.type) {
    case "class":
      var cls = actor.data.data.class;
      cls.name = item.name;
      for (let [key, value] of Object.entries(item.data.defense)) {
        cls.defense[key] = value;
      }
      var features = [];
      
      for(let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      actor.data.data.features.class = [...features];
      break;
    case "race":
      var race = actor.data.data.race;
      race.name = item.name;
      var features = [];
      
      for(let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      actor.data.data.features.race = [...features];
      break;
  }
});