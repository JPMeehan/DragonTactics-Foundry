

/**
 * Extend the base Actor entity for the Dragon Tactics System
 * @extends {Actor}
 */
export class DragonTacticsActor extends Actor {
  // /*
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;

    // Ability scores
    for (let abl of Object.values(data.abilities)) {
      abl.mod = Math.floor((abl.score - 10) / 2);
      if (abl.mod < 0) abl.modifier = "" + abl.mod;
      else abl.modifier = "+" + abl.mod;
    }
    console.log("Ability scores done")

    
    if ( actorData.type === "hero" ) this._prepareHeroData(actorData);
    else if ( actorData.type === "npc" ) this._prepareNPCData(actorData);

    
    // Health
    data.health.bloodied = Math.floor((data.health.max + data.health.tempmax) / 2);
    data.surges.heal = Math.floor((data.health.max + data.health.tempmax) / 4);
  }

  _prepareHeroData(actorData) {
    const data = actorData.data;
    
    data.ac.value = 10 + this.armorabil(data.abilities[data.equipment.worn.armor.ability],"score")  + data.class.quest + data.ac.miscbonus + data.equipment.worn.armor.bonus + data.equipment.worn.arms.shield;
    data.fortitude.value = 10 + Math.max(data.abilities.strength.mod, data.abilities.constitution.mod) + data.class.quest + data.fortitude.miscbonus;
    data.reflex.value = 10 + Math.max(data.abilities.dexterity.mod, data.abilities.intelligence.mod) + data.class.quest + data.reflex.miscbonus + data.equipment.worn.arms.shield;
    data.will.value = 10 + Math.max(data.abilities.wisdom.mod, data.abilities.charisma.mod) + data.class.quest + data.will.miscbonus;
    
    data.health.max = data.class.defense.hpBase + data.abilities.constitution.score + (data.class.level - 1) * data.class.hpLevel + data.bonus.hp;
    data.surges.max = data.class.defense.surges + data.abilities.constitution.mod + data.bonus.surges;

    for (let skill of Object.values(data.skill)) {
      skill.rank_bonus = this.training(skill.rank);
      skill.mod = data.abilities[skill.ability].mod + skill.rank_bonus + skill.miscbonus + data.class.quest;
      if (skill.mod < 0) skill.modifier = "" + skill.mod;
      else skill.modifier = "+" + skill.mod;
    }
  }

  _prepareNPCData(actorData) {
    const data = actorData.data;
  }

  training(skill) {
    if (skill == "Adept") {
        return 2;
    } else if (skill == "Trained") {
        return 4;
    } else if (skill == "Experienced") {
        return 6;
    } else if (skill == "Expert") {
        return 8;
    } else if (skill == "Master") {
        return 10;
    } else {
        return 0;
    }
  }

  armorabil(obj, prop) {
    return( obj == null ? 0 : obj[prop] );
  }
  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */

  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    for (let attr of Object.values(data.data.attributes)) {
      attr.isCheckbox = attr.dtype === "Boolean";
    }

    // Prepare items.
    if (this.actor.data.type == 'character') {
      this._prepareCharacterItems(data);
    }

    return data;
  }


  _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;

    // Initialize containers.
    const cls = [];
    const equipment = { // armor, implement, supplies, weapon
      "armor": [],
      "worn": [],
      "carried": [],
      "home": []
    };
    const features = { // feature
      "race": [],
      "class": [],
      "feat": [],
      "flaw": [],
      "competency": []
    };
    const powers = {}; // power
    const rituals = []; // ritual (need to add to sheet)

    // Iterate through items, allocating to containers
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;

      if (i.type === 'class') {
        cls.push(i);
        cls.name = item.name;
        cls.defense = item.data.defense;
      }
      else if (i.type === 'race') {
        actorData.race = item.name;
      }
      else if (i.type === 'feature') features[item.data.type].push(i);
      else if (i.type === 'powers') powers.push(i);
      else if (i.type === 'ritual') rituals.push(i);
    }

    while (cls.length > 1) {
      console.log("Deleting " + cls[0].data.name);
      delete cls[0];
      cls.shift();
    }

    // Assign and return
    actorData.class.name = cls[0].data.name;
    actorData.class.defense = cls[0].data.defense;
    actorData.powers = powers;
    actorData.features = features;
    actorData.equipment.rituals = rituals;

  }
  /* */
}
