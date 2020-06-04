/*************

NEW ITEM

*************/

Hooks.on('createOwnedItem', (actor, item) => {
  const data = duplicate(actor.data.data);
  switch (item.type) {
    case "class":
      if (data.class._id != "") {
        actor.deleteOwnedItem(data.class._id)
      }
      data.class.name = item.name;
      data.class._id = item._id;
      for (let [key, value] of Object.entries(item.data.defense)) {
        data.class.defense[key] = value;
      }

      for (let [key, value] of Object.entries(data.class.source)) {
        data.class.source[key] = item.data.source === key
      }
      data.sourcepoints.exist = data.class.source.arcane || data.class.source.primal || data.class.source.psionic || data.class.source.shadow 

      var features = data.features.class;

      for (let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      break;
    case "race":
      if (data.race._id != "") {
        actor.deleteOwnedItem(data.race._id)
      }
      data.race.name = item.name;
      data.race._id = item._id;

      var features = data.features.race;

      for (let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      break;
    case "feature":
      var features = data.features[item.data.type] || {};
      const newfeature = {
        "label": item.name,
        "description": item.data.description
      };
      features[item._id] = newfeature;
      break;
    case "power":
      const newpower = {
        "name": item.name
      }
      for (let [key, value] of Object.entries(item.data)) {
        newpower[key] = value;
      }
      newpower.attack["weapon"] = "";
      newpower.attack["hitbonus"] = "";
      newpower.attack["flat"] = "";
      newpower.attack["damagedice"] = "";
      newpower.attackSecondary["weapon"] = "";
      newpower.attackSecondary["hitbonus"] = "";
      newpower.attackSecondary["flat"] = "";
      newpower.attackSecondary["damagedice"] = "";
      newpower.attackTertiary["weapon"] = "";
      newpower.attackTertiary["hitbonus"] = "";
      newpower.attackTertiary["flat"] = "";
      newpower.attackTertiary["damagedice"] = "";
      switch (newpower.recharge) {
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
      break;
    case "equipment":
      const newequipment = {
        "label": item.name,
        "quantity": item.data.quantity,
        "size": item.data.price,
        "equipped": false
      }
      if (item.data.is.weapon) {
        newequipment["proficiency"] = item.data.weapon.proficiency;
        newequipment["damage"] = item.data.weapon.damage;
        newequipment["range"] = item.data.weapon.range;
        newequipment["hicrit"] = item.data.weapon.hicrit;
        newequipment["brutal"] = item.data.weapon.brutal;
      }
      if (item.data.is.implement) {
        newequipment["proficiency"] = item.data.implement.proficiency;
      }
      if (item.data.is.armor) {
        newequipment["ac"] = item.data.armor.ac;
      }
      if (item.data.is.shield) {
        newequipment["shield"] = item.data.shield.bonus;
      }
      data.equipment.worn[item.data.type][item._id] = newequipment;
      break;
    case "ritual":
      const newritual = {
        "label": item.name,
        "category": item.data.category,
        "componentCost": item.data.componentCost,
        "castingTime": item.data.castingTime,
        "duration": item.data.duration,
        "description": item.data.description
      }
      data.rituals[item._id] = newritual;
  }
  actor.update({
    "data": data
  })
});

/*************

UPDATE ITEM

*************/

Hooks.on('updateOwnedItem', (actor, item, delta) => {
  const data = duplicate(actor.data.data);
  switch (item.type) {
    case "class":
      data.class.name = item.name;
      for (let [key, value] of Object.entries(item.data.defense)) {
        data.class.defense[key] = value;
      }


      for (let [key, value] of Object.entries(data.class.source)) {
        data.class.source[key] = item.data.source === key
      }
      data.sourcepoints.exist = data.class.source.arcane || data.class.source.primal || data.class.source.psionic || data.class.source.shadow

      var features = data.features.class;

      for (let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      break;
    case "race":
      data.race.name = item.name;

      var features = data.features.race;

      for (let [key, value] of Object.entries(item.data.features)) {
        features.push({
          "label": value.label,
          "description": value.value
        });
      }
      break;
    case "feature":
      var target;
      try {
        target = Object.keys(delta.data)[0];
      }
      catch (e) {
        target = Object.keys(delta)[0]
      }
      var features = data.features[item.data.type] || {};
      if (target === "type") {
        var oldtype;
        var oldfeatures;
        const featuretypes = ["feat", "competency", "flaw"]

        // go through eligible lists
        for (let type = 0; type < 3; type++) {
          if (featuretypes[type] === item.data.type) {
            features[item._id] = {
              "label": item.name,
              "description": item.data.description
            }
          } else {
            if (data.features[featuretypes[type]][item._id]) {
              oldtype = featuretypes[type];
              oldfeatures = data.features[oldtype] || {};
              delete oldfeatures[item._id];
              oldfeatures[key]["-=" + item._id] = null;
            }
          }
        }
      } else {
        features[item._id] = {
          "label": item.name,
          "description": item.data.description
        }
      }
      break;
    case "power":
      const newpower = {
        "name": item.name
      }
      for (let [key, value] of Object.entries(item.data)) {
        newpower[key] = value;
      }
      switch (newpower.recharge) {
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
      break;
    case "equipment":
      var target;
      try {
        target = Object.keys(delta.data)[0];
      }
      catch (e) {
        target = Object.keys(delta)[0]
      }
      if (target === "type") {

        // go through eligible lists
        for (let [key, value] of Object.entries(data.equipment.worn)) {
          if (key === item.data.type) {
            const newequipment = {
              "label": item.name,
              "quantity": item.data.quantity,
              "size": item.data.price,
              "equipped": false
            }
            if (item.data.is.weapon) {
              newequipment.weapon = {}
              newequipment.weapon.proficiency = item.data.weapon.proficiency;
              newequipment.weapon.damage = item.data.weapon.damage;
              newequipment.weapon.range = item.data.weapon.range;
            }
            if (item.data.is.implement) {
              newequipment.implement = {}
              newequipment.implement.proficiency = item.data.implement.proficiency;
            }
            if (item.data.is.armor) {
              newequipment.armor = {}
              newequipment.armor.ac = item.data.armor.ac;
            }
            if (item.data.is.shield) {
              newequipment.shield = {}
              newequipment.shield.bonus = item.data.shield.bonus;
            }
            data.equipment.worn[key][item._id] = newequipment;
          } else {
            if (value[item._id]) {
              delete data.equipment.worn[key][item._id];
              data.equipment.worn[key]["-=" + item._id] = null;
            }
          }
        }
      } else {
        var equipment = data.equipment.worn[item.data.type][item._id];
        equipment["label"] = item.name;
        equipment["quantity"] = item.data.quantity;
        equipment["size"] = item.data.price;
        if (item.data.is.weapon) {
          equipment["proficiency"] = item.data.weapon.proficiency;
          equipment["damage"] = item.data.weapon.damage;
          equipment["range"] = item.data.weapon.range;
          equipment["hicrit"] = item.data.weapon.hicrit;
          equipment["brutal"] = item.data.weapon.brutal;
        }
        if (item.data.is.implement) {
          equipment["proficiency"] = item.data.implement.proficiency;
        }
        if (item.data.is.armor) {
          equipment["ac"] = item.data.armor.ac;
          equipment["penalty"] = item.data.armor.penalty;
          equipment["speed"] = item.data.armor.speed;
        }
        if (item.data.is.shield) {
          equipment["shield"] = item.data.shield.bonus;
          equipment["penalty"] = item.data.shield.penalty;
        }
      }
      break;
    case "ritual":
      const ritual = data.rituals[item._id];
      ritual["label"] = item.name;
      ritual["category"] = item.data.category;
      ritual["componentCost"] = item.data.componentCost;
      ritual["castingTime"] = item.data.castingTime;
      ritual["duration"] = item.data.duration;
      ritual["description"] = item.data.description;
  }
  actor.update({
    "data": data
  });
});