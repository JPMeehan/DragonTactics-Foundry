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


  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add or Remove Attribute
    html.find(".features").on("click", ".feature-control", this._onClickPowerControl.bind(this));
  }


  /**
   * Listen for click events on an attribute control to modify the composition of powers in the sheet
   * @param {MouseEvent} event    The originating left click event
   * @private
   */
  async _onClickPowerControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;
    const attrs = this.object.data.data.powers;
    const form = this.form;

    // Add new attribute
    if (action === "create") {
      const nk = Object.keys(attrs).length + 1;
      let newKey = document.createElement("div");
      newKey.innerHTML = `<input type="text" name="data.powers.power${nk}.key" value="power${nk}"/>`;
      newKey = newKey.children[0];
      form.appendChild(newKey);
      await this._onSubmit(event);
    }

    // Remove existing attribute
    else if (action === "delete") {
      const li = a.closest(".feature");
      li.parentElement.removeChild(li);
      await this._onSubmit(event);
    }
  }


  /** @override */
  _updateObject(event, formData) {

      // Handle the free-form powers list
      const formAttrs = expandObject(formData).data.powers || {};
      const powers = Object.values(formAttrs).reduce((obj, v) => {
        let k = v["key"].trim();
        if (/[\s\.]/.test(k)) return ui.notifications.error("Attribute keys may not contain spaces or periods");
        delete v["key"];
        obj[k] = v;
        return obj;
      }, {});

      // Remove powers which are no longer used
      for (let k of Object.keys(this.object.data.data.powers)) {
        if (!powers.hasOwnProperty(k)) powers[`-=${k}`] = null;
      }

      // Re-combine formData
      formData = Object.entries(formData).filter(e => !e[0].startsWith("data.powers")).reduce((obj, e) => {
        obj[e[0]] = e[1];
        return obj;
      }, {
        _id: this.object._id,
        "data.powers": powers
      });
    // Update the Item
    return this.object.update(formData);
  }
}