/**
 * Dragon Tactics game system for Foundry Virtual Tabletop based on the dnd5e and worldbuilder sheets
 * Author: ChaosOS
 */

// import {myHooks} from "./hooks/items.js";

import "./hooks/items.js";

import {DRAGONTACTICS} from "./config.js"
import { rollInitiative, setupTurns } from "./initiative/cardInit"
import { DragonTacticsSetup } from "./setupHandler.js"
import { createActionCardTable } from "./initiative/util.js"

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

Hooks.on('renderCombatTracker', (app, html, data) => {
  const currentCombat = data.combats[data.combatCount - 1];
  html.find('.combatant').each((i, el) => {
      const combId = el.getAttribute('data-combatant-id');
      const combatant = currentCombat.data.combatants.find(c => c._id == combId);
      if (combatant.hasRolled) {
          el.getElementsByClassName('token-initiative')[0].innerHTML = `<span class="initiative">${combatant.flags.dragontactics.cardString}</span>`;
      }
  });
});
Hooks.on('preUpdateCombat', async (combat, updateData, options, userId) => {
  // Return early if we are NOT a GM OR we are not the player that triggered the update AND that player IS a GM
  const user = game.users.get(userId, { strict: true });
  if (!game.user.isGM || (game.userId !== userId && user.isGM)) {
      return;
  }
  // Return if this update does not contains a round
  if (!updateData.round) {
      return;
  }
  if (combat instanceof CombatEncounters) {
      combat = game.combats.get(updateData._id, { strict: true });
  }
  // If we are not moving forward through the rounds, return
  if (updateData.round < 1 || updateData.round < combat.previous.round) {
      return;
  }
  // If Combat has just started, return
  if ((!combat.previous.round || combat.previous.round === 0) && updateData.round === 1) {
      return;
  }
  let jokerDrawn = false;
  // Reset the Initiative of all combatants
  combat.combatants.forEach((c) => {
      if (c.flags.dragontactics && c.flags.dragontactics.hasJoker) {
          jokerDrawn = true;
      }
  });
  const resetComs = combat.combatants.map(c => {
      c.initiative = null;
      c.hasRolled = false;
      c.flags.dragontactics.cardValue = null;
      c.flags.dragontactics.suitValue = null;
      c.flags.dragontactics.hasJoker = null;
      return c;
  });
  updateData.combatants = resetComs;
  // Reset the deck if any combatant has had a Joker	
  if (jokerDrawn) {
      const deck = game.tables.getName(CONFIG.DRAGONTACTICS.init.cardTable);
      await deck.reset();
      ui.notifications.info('Card Deck automatically reset');
  }
  //Init autoroll
  if (game.settings.get('dragontactics', 'autoInit')) {
      const combatantIds = combat.combatants.map(c => c._id);
      await combat.rollInitiative(combatantIds);
  }
});