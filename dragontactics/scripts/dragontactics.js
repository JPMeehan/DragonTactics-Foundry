/**
 * Dragon Tactics game system for Foundry Virtual Tabletop based on the dnd5e and worldbuilder sheets
 * Author: ChaosOS
 */
 
import { DragonTacticsActor } from "./actors/entity.js";
import { HeroDragonTacticsActorSheet } from "./actors/hero.js";
import { CombatantNPCDragonTacticsActorSheet } from "./actors/combatant.js";
import { NPCDragonTacticsActorSheet } from "./actors/npc.js";

import { DragonTacticsItemSheet } from "./items/item-sheet.js"
import { DragonTacticsItem } from "./items/entity.js"

Hooks.once("init", function() {
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
  Actors.registerSheet("dragontactics", HeroDragonTacticsActorSheet, { types: ["hero"], makeDefault: true });
  Actors.registerSheet("dragontactics", CombatantNPCDragonTacticsActorSheet, { types: ["combatant"], makeDefault: true });
  Actors.registerSheet("dragontactics", NPCDragonTacticsActorSheet, { types: ["combatant"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("dragontactics", DragonTacticsItemSheet, {makeDefault: true});

  // Preload Handlebars Templates
  // preloadHandlebarsTemplates();
});