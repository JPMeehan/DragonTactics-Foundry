import { d20Roll, damageRoll } from "../dice.js";


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
    const worn = data.equipment.worn;

    data.equipment.armor.torso.bonus = this.nullprop(data.equipment.worn.armor[data.equipment.equipped.armor], "ac");
    data.equipment.armor.shield.bonus = this.nullprop(data.equipment.worn.arms[data.equipment.equipped.arms], "shield");
    
    data.ac.value = 10 + data.equipment.armor.ability + data.class.quest + data.equipment.armor.torso.bonus + data.equipment.armor.shield.bonus + data.ac.miscbonus;
    data.fortitude.value = 10 + Math.max(data.abilities.strength.mod, data.abilities.constitution.mod) + data.class.quest + data.class.defense.fortitude + data.fortitude.miscbonus;
    data.reflex.value = 10 + Math.max(data.abilities.dexterity.mod, data.abilities.intelligence.mod) + data.class.quest + data.class.defense.reflex + data.equipment.armor.shield.bonus + data.reflex.miscbonus;
    data.will.value = 10 + Math.max(data.abilities.wisdom.mod, data.abilities.charisma.mod) + data.class.quest + data.class.defense.will + data.will.miscbonus;
    
    data.health.max = data.class.defense.hpBase + data.abilities.constitution.score + (data.class.level - 1) * data.class.defense.hpLevel + data.class.bonus.hp;
    data.surges.max = data.class.defense.surges + data.abilities.constitution.mod + data.class.bonus.surges;

    for (let skill of Object.values(data.skill)) {
      skill.rank_bonus = this.training(skill.rank);
      skill.mod = data.abilities[skill.ability].mod + skill.rank_bonus + skill.miscbonus + data.class.quest;
    }

    for (let type in  data.equipment.equipped) {
      for (let key in worn[type]){
        if (key === data.equipment.equipped[type]) {worn[type][key].equipped = true}
        else {worn[type][key].equipped = false}
      }
    }


    let filters = false;
    Object.values(data.powerfilters).forEach(bool => filters = filters || bool)

    const attacks = ["attack", "attackSecondary", "attackTertiary"]
    for (let [key, power] of Object.entries(data.powers)) {

      if (filters) {
        let action = power.action.toLowerCase();
        if (action.search("free")>=0) {action = "free"}
        else if (action.search("immediate")>=0) {action = "immediate"}
        power.filtered = data.powerfilters[action]
      }
      else {power.filtered = true}

      for (let i = 0; i<3; i++ ) {
        if (power[attacks[i]].exist) {
          let prof = 0;
          if (power[attacks[i]].weapon) {
            prof = Math.max(this.nullprop(data.equipment.worn.weapons[power[attacks[i]].weapon], "proficiency"), this.nullprop(data.equipment.worn.implements[power[attacks[i]].weapon], "proficiency"))
          }
          power[attacks[i]].hitbonus = data.class.quest + data.abilities[power[attacks[i]].stat].mod + power[attacks[i]].hit.miscAttack + prof;
          power[attacks[i]].flat = data.class.quest + this.nullprop(data.abilities[power[attacks[i]].hit.abi], "mod") + power[attacks[i]].hit.miscDamage;
          if (power[attacks[i]].hit.weapon.use  && data.equipment.worn.weapons[power[attacks[i]].weapon]) {
            const rgx = new RegExp(Die.rgx.die, "g");
            if (power[attacks[i]].hit.weapon.dice > 0){
              power[attacks[i]].damagedice = data.equipment.worn.weapons[power[attacks[i]].weapon].damage.replace(rgx, (match, nd, d, mods) => {
                  nd = (nd * (power[attacks[i]].hit.weapon.dice || 1));
                  mods = mods || "";
                  return nd + "d" + d + mods
              });
            }
            else {power[attacks[i]].damagedice = ""}
          }
          else {
            power[attacks[i]].damagedice = power[attacks[i]].hit.dice
          }
        }
      }
    }


    for (let [key, ritual] of Object.entries(data.rituals)) {
      ritual.filtered = true
      if (data.ritualfilters.level) {ritual.filtered = ritual.level == data.ritualfilters.level}
      if (data.ritualfilters.category != "none") {ritual.filtered = ritual.filtered && (ritual.category.toLowerCase().indexOf(data.ritualfilters.category) >= 0)}
    }

    const encumbrance = data.equipment.encumbrance;

    switch (encumbrance.size) {
      case "Tiny":
        encumbrance.max = 6 + data.abilities.strength.score;
        break;
      case "Small":
        encumbrance.max = 10 + data.abilities.strength.score;
        break;
      case "Medium":
        encumbrance.max = 14 + data.abilities.strength.score;
        break;
      case "Large":
        encumbrance.max = 18 + data.abilities.strength.score;
        break;
      default:
        encumbrance.max = 14 + data.abilities.strength.score; 
    }
    encumbrance.value = 0

    for (let [key, category] of Object.entries(data.equipment.worn)) {
      if (isObjectEmpty(category)) {continue}
      for (let [key, item] of Object.entries(category)) {
        encumbrance.value += parseInt(item.size)
      }
    }

    encumbrance.pct = encumbrance.value.toFixed(2) / encumbrance.max.toFixed(2) * 100


  }

  _prepareNPCData(actorData) {
    const data = actorData.data;

    for (let skill of Object.values(data.skill)) {
      skill.rank_bonus = this.training(skill.rank);
      skill.mod = data.abilities[skill.ability].mod + skill.rank_bonus + skill.miscbonus;
    }

    if (data.config.scale === "minion") {data.health.max = 1}
    else {
      let config = {
        "low": {
          hpmult: 5,
          hpbase: 17
        },
        "medium": {
          hpmult: 7,
          hpbase: 21
        },
        "high": {
          hpmult: 9,
          hpbase: 26
        }
      }
      let hpscale = (data.config.scale === "normal" ) ? 1 : (data.config.scale === "elite") ? 2 : 5;
  
      data.health.max = (data.config.level * config[data.config.hp].hpmult + config[data.config.hp].hpbase)*hpscale;
      data.ac.value = 15 + Math.floor(data.config.level/2) + data.ac.miscbonus;
      data.fortitude.value = 13 + Math.floor(data.config.level/2) + data.fortitude.miscbonus;
      data.reflex.value = 13 + Math.floor(data.config.level/2) + data.reflex.miscbonus;
      data.will.value = 13 + Math.floor(data.config.level/2) + data.will.miscbonus;
    }

    
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

  nullprop(obj, prop) {
    return( obj == null ? 0 : obj[prop] );
  }

  rollSkillCheck(skillId, options={}) {
    const skl = this.data.data.skill[skillId];

    // Compose roll parts and data
    const parts = ["@mod"];
    const data = {mod: skl.mod};
    
    return d20Roll(mergeObject(options, {
      parts: parts,
      data: data,
      title: skl.label + " Skill Check" + " (" + skl.rank + ")",
      speaker: ChatMessage.getSpeaker({actor: this})
    }));

  }

  rollAbilityCheck(ability, options={}) {
    const abi = this.data.data.abilities[ability];

    // Compose roll parts and data
    const parts = ["@mod"];
    const data = {mod: abi.mod};

    return d20Roll(mergeObject(options, {
      parts: parts,
      data: data,
      title: abi.label + " Ability Check",
      speaker: ChatMessage.getSpeaker({actor: this})
    }));
  }

  rollAttack(power, attack, options={}) {
    const atk = this.data.data.powers[power][attack]

    const parts = ["@hitbonus"];
    const data = {hitbonus: atk.hitbonus};
    const flavor = this.data.data.powers[power].name + " vs. " + atk.def;

    return d20Roll(mergeObject(options, {
      parts: parts,
      data: data,
      flavor: flavor,
      title: this.data.data.powers[power].name,
      speaker:  ChatMessage.getSpeaker({actor: this})
    }))
  }

  rollDamage(power, attack, options={}) {
    const atk = this.data.data.powers[power][attack];

    const parts = ["@damagedice", "@flatdamage"]
    const data = {damagedice: atk.damagedice, flatdamage: atk.flat}
    let quest = 0;
    let hicrit = false;
    let weapondie = null;
    if (this.datatype == "hero"){
      quest = this.data.data.class.quest;
      const weapon = this.data.data.equipment.worn.weapons[atk.weapon];
      hicrit = weapon ? weapon.hicrit : false
      weapondie = hicrit ? weapon.damage : null
      if (weapon) {
        if (weapon.brutal) {
          data.damagedice+="r<=" + weapon.brutal;
          weapondie = weapondie ? weapondie+="r<=" + weapon.brutal : null;
        }
      }
    }

    return damageRoll(mergeObject(options, {
      parts: parts,
      data: data,
      quest: quest,
      title: this.data.data.powers[power].name,
      speaker:  ChatMessage.getSpeaker({actor: this}),
      hicrit: hicrit,
      weapondie: weapondie
    }))
  }
}
