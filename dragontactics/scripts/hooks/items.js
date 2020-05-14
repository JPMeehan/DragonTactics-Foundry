Hooks.on('createOwnedItem', (actor, item) => {
  console.log(actor);
  console.log(item);
  switch (item.type) {
    case "class":
      cls = actor.data.data.class;
      oldID = cls._id;
      if (oldID != "") {this.deleteOwnedItem(oldID)}
      cls.name = item.name;
      cls._id = item._id;
      for (let [key, value] of Object.entries(item.data.defense)) {
        cls.defense[key] = value;
      }
      break;
    case "race":
      oldID = this.data.data.race._id;
      if (oldID != "") {this.deleteOwnedItem(oldID)}
      break;
  }
});