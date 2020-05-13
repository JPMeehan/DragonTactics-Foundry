

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
    // console.log("Ability scores done")

    
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
    
    data.health.max = data.class.defense.hpBase + data.abilities.constitution.score + (data.class.level - 1) * data.class.defense.hpLevel + data.class.bonus.hp;
    data.surges.max = data.class.defense.surges + data.abilities.constitution.mod + data.class.bonus.surges;

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

  /** @override */
  async createOwnedItem(itemData, options) {
    if (itemData.type = "class" || "race"){
      oldID = this.data[itemData.type]._id;
      if (oldID != "") {this.deleteOwnedItem(oldID)}
    }
    return super.createOwnedItem(itemData, options);
  }
  
  /* */
}
