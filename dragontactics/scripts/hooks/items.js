Hooks.on('createOwnedItem', (actor, item) => {
  console.log("Creating an Item")
  switch (item.type) {
    case "class":
      var cls = actor.data.data.class;
      const oldID = cls._id;
      if (oldID != "") {actor.deleteOwnedItem(oldID)}
      cls.name = item.name;
      cls._id = item._id;
      for (let [key, value] of Object.entries(item.data.defense)) {
        cls.defense[key] = value;
      }
      break;
    case "race":
      var race = actor.data.data.race;
      const oldID = race._id;
      if (oldID != "") {actor.deleteOwnedItem(oldID)}
      race.name = item.name;
      break;
  }
});

Hooks.on('updateOwnedItem', (actor, item) => {
  console.log("Updating an item")
  console.log(actor);
  console.log(item)
  switch (item.type) {
    case "class":
      var cls = actor.data.data.class;
      cls.name = item.name;
      for (let [key, value] of Object.entries(item.data.defense)) {
        cls.defense[key] = value;
      }
      break;
    case "race":
      var race = actor.data.data.race;
      race.name = item.name;
      break;
  }
});