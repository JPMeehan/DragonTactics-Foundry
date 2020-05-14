
// export class myHooks {
//   static callHooks() {
    Hooks.on('createOwnedItem', (actor, item) => {
      console.log(actor);
      console.log(item);
    });
//   }
// }
/*
_prepareHeroItems(sheetData) {
    const actorData = sheetData.actor.data;

    // Initialize containers.
    // const equipment = { // armor, implement, supplies, weapon
    //   "armor": [],
    //   "worn": [],
    //   "carried": [],
    //   "home": []
    // };
    const features = { // feature
      "race": [],
      "class": [],
      "feat": [],
      "flaw": [],
      "competency": []
    };
    const powers = []; // power
    // const rituals = []; // ritual (need to add to sheet)

    // Iterate through items, allocating to containers
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;

      if (i.type === 'class') {
        actorData.class.name = i.name;
        actorData.class._id = i._id;
        for (let [key, value] of Object.entries(item.defense)) {
          actorData.class.defense[key] = value;
        }
      }
      else if (i.type === 'race') {
        actorData.race.name = item.name;
        actorData.race._id = item._id;
      }
      else if (i.type === 'feature') features[item.data.type].push(i);
      else if (i.type === 'powers') powers.push(i);
      // else if (i.type === 'ritual') rituals.push(i);
    }

    // Assign and return
    actorData.powers = powers;
    actorData.features = features;
    // actorData.equipment.rituals = rituals;

}

  async createOwnedItem(itemData, options) {
    if (itemData.type = "class" || "race"){
      oldID = this.data.data[itemData.type]._id;
      if (oldID != "") {this.deleteOwnedItem(oldID)}
    }
    return super.createOwnedItem(itemData, options);
  }
  
  /* */