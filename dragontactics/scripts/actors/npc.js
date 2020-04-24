/**
 * Extend the DragonTacticsActorSheet for use with NPCs
 * @extends {DragonTacticsActorSheet}
 */

import {
  DragonTacticsActorSheet
} from "./base.js"

export class NPCDragonTacticsActorSheet extends DragonTacticsActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["dragontactics", "sheet", "actor"],
      template: "systems/dragontactics/templates/actors/npc.html",
      width: 600,
      height: 600,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "description"
      }]
    });
  }
}