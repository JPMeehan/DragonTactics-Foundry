/**
 * Dragon Tactics game system for Foundry Virtual Tabletop based on the dnd5e and worldbuilder sheets
 * Author: ChaosOS
 */
 
import { HeroDragonTacticsActorSheet } from "./actors/hero.js";


Hooks.once("init", function() {
  console.log(`D&D5e | Initializing Dungeons & Dragons 5th Edition System\n${DND5E.ASCII}`);

  // Create a D&D5E namespace within the game global
  // game.dnd5e = {
    // Actor5e,
    // Dice5e,
    // Item5e,
    // migrations,
    // rollItemMacro
  // };

  // Record Configuration Values
  // CONFIG.DND5E = DND5E;
  // CONFIG.Actor.entityClass = Actor5e;
  // CONFIG.Item.entityClass = Item5e;

  // Register System Settings
  // registerSystemSettings();

  // Patch Core Functions
  // Combat.prototype._getInitiativeFormula = _getInitiativeFormula;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("dnd5e", ActorSheet5eCharacter, { types: ["character"], makeDefault: true });
  Actors.registerSheet("dnd5e", ActorSheet5eNPC, { types: ["npc"], makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("dnd5e", ItemSheet5e, {makeDefault: true});

  // Preload Handlebars Templates
  preloadHandlebarsTemplates();
});