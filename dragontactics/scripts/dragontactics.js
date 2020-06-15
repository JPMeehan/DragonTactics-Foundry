/**
 * Dragon Tactics game system for Foundry Virtual Tabletop based on the dnd5e and worldbuilder sheets
 * Author: ChaosOS
 */

import "./items/hooks.js"
import "./initiative/hooks.js";

import { DRAGONTACTICS } from "./config.js"
import { rollInitiative, setupTurns } from "./initiative/cardInit.js"
import { DragonTacticsSetup } from "./setupHandler.js"
import { createActionCardTable } from "./initiative/util.js"
import { registerSettings } from "./settings.js";

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
  DragonTacticsItemSheet_class
} from "./items/sheets/class.js";
import {
  DragonTacticsItemSheet_equipment
} from "./items/sheets/equipment.js";
import {
  DragonTacticsItemSheet_feature
} from "./items/sheets/feature.js";
import {
  DragonTacticsItemSheet_power
} from "./items/sheets/power.js";
import {
  DragonTacticsItemSheet_race
} from "./items/sheets/race.js";
import {
  DragonTacticsItemSheet_ritual
} from "./items/sheets/ritual.js";



Hooks.once("init", function () {
  console.log(`Initializing Dragon Tactics System`);

  // Record Configuration Values
  CONFIG.DRAGONTACTICS = DRAGONTACTICS;
  Combat.prototype.rollInitiative = rollInitiative;
  Combat.prototype.setupTurns = setupTurns;
  CONFIG.Actor.entityClass = DragonTacticsActor;
  CONFIG.Item.entityClass = DragonTacticsItem;

  // Register System Settings
  registerSettings();

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
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_class, {
    types: ["class"],
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_equipment, {
    types: ["equipment"],
    makeDefault: true
  })
  Items.registerSheet("dragontactics", DragonTacticsItemSheet_feature, {
    types: ["feature"],
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

  // Preload Handlebars Templates
  // preloadHandlebarsTemplates();
});

Hooks.once('ready', async () => {
  let packChoices = {};
  game.packs.filter(p => p.entity === 'JournalEntry').forEach(p => {
      packChoices[p.collection] = p.metadata.label;
  });
  game.settings.register('dragontactics', 'cardDeck', {
      name: 'Card Deck to use for Initiative',
      scope: 'world',
      type: String,
      config: true,
      default: CONFIG.DRAGONTACTICS.init.defaultCardCompendium,
      choices: packChoices,
      onChange: (choice) => {
          console.log(`Repopulating action cards Table with cards from deck ${choice}`);
          createActionCardTable(true, choice).then(ui.notifications.info('Table re-population complete'));
      }
  });
  await DragonTacticsSetup.setup();
});