/**
 * Extend the DragonTacticsActorSheet for use with Heros (PCs)
 * @extends {DragonTacticsActorSheet}
 */


import {
  DragonTacticsActorSheet
} from "./base.js";

export class HeroDragonTacticsActorSheet extends DragonTacticsActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["dragontactics", "sheet", "actor"],
      template: "systems/dragontactics/templates/actors/hero.html",
      width: 600,
      height: 600,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "description"
      }],
      scrollY: [".save-scroll"]
    });
  }
}