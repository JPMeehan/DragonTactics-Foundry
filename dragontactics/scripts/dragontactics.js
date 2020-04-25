/**
 * Dragon Tactics game system for Foundry Virtual Tabletop based on the dnd5e and worldbuilder sheets
 * Author: ChaosOS
 */

import {
  DragonTacticsActor
} from "./actors/entity.js";
import {
  HeroDragonTacticsActorSheet
} from "./actors/hero.js";
import {
  NPCDragonTacticsActorSheet
} from "./actors/npc.js";

import {
  DragonTacticsItem
} from "./items/entity.js";
import {
  DragonTacticsItemSheet_armor
} from "./items/sheets/armor.js";
import {
  DragonTacticsItemSheet_class
} from "./items/sheets/class.js";
import {
  DragonTacticsItemSheet_feature
} from "./items/sheets/feature.js";
import {
  DragonTacticsItemSheet_implement
} from "./items/sheets/implement.js";
import {
  DragonTacticsItemSheet_power
} from "./items/sheets/power.js";
import {
  DragonTacticsItemSheet_race
} from "./items/sheets/race.js";
import {
  DragonTacticsItemSheet_ritual
} from "./items/sheets/ritual.js";
import {
  DragonTacticsItemSheet_supplies
} from "./items/sheets/supplies.js";
import {
  DragonTacticsItemSheet_weapon
} from "./items/sheets/weapon.js";


Hooks.once("init", function () {
  console.log(`Initializing Dragon Tactics System`);

  // Create a D&D5E namespace within the game global
  // game.dnd5e = {
  // Actor5e,
  // Dice5e,
  // Item5e,
  // migrations,
  // rollItemMacro
  // };

  // Record Configuration Values
  CONFIG.Actor.entityClass = DragonTacticsActor;
  CONFIG.Item.entityClass = DragonTacticsItem;

  // Register System Settings
  // registerSystemSettings();

  // Patch Core Functions
  // Combat.prototype._getInitiativeFormula = _getInitiativeFormula;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("dragontactics", HeroDragonTacticsActorSheet, {
    types: ["hero"],
    makeDefault: true
  });
  Actors.registerSheet("dragontactics", NPCDragonTacticsActorSheet, {
    types: ["npc"],
    makeDefault: true
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_armor, {
    types: ["armor"],
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_class, {
    types: ["class"],
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_feature, {
    types: ["feature"],
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_implement, {
    types: ["implement"],
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_power, {
    types: ["power"],
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_race, {
    types: ["race"],
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_ritual, {
    types: ["ritual"],
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_supplies, {
    types: ["supplies"],
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_weapon, {
    types: ["weapon"],
    makeDefault: true
  })

  // Preload Handlebars Templates
  // preloadHandlebarsTemplates();
});