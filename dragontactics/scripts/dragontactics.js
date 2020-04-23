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
} from "./items/entity.js"
import {
  DragonTacticsItemSheet
} from "./items/sheets/item-sheet.js"
import {
  DragonTacticsItemSheet_armor
} from "./items/sheets/armor"
import {
  DragonTacticsItemSheet_class
} from "./items/sheets/class"
import {
  DragonTacticsItemSheet_competency
} from "./items/sheets/competency"
import {
  DragonTacticsItemSheet_feat
} from "./items/sheets/feat"
import {
  DragonTacticsItemSheet_implement
} from "./items/sheets/implement"
import {
  DragonTacticsItemSheet_power
} from "./items/sheets/power"
import {
  DragonTacticsItemSheet_race
} from "./items/sheets/race"
import {
  DragonTacticsItemSheet_ritual
} from "./items/sheets/ritual"
import {
  DragonTacticsItemSheet_supplies
} from "./items/sheets/supplies"
import {
  DragonTacticsItemSheet_weapon
} from "./items/sheets/weapon"


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
    types: ["combatant"],
    makeDefault: true
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("dragontactics", DragonTacticsItemSheet, {
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_armor, {
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_class, {
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_competency, {
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_feat, {
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_implement, {
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_power, {
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_race, {
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_ritual, {
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_supplies, {
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_weapon, {
    makeDefault: true
  })

  // Preload Handlebars Templates
  // preloadHandlebarsTemplates();
});