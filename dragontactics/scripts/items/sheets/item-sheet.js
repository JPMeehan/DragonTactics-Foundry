/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class DragonTacticsItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["dragontactics", "sheet", "item"],
      template: "systems/dragontactics/templates/items/item-sheet.html",
      width: 520,
      height: 480,
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
    html.find(".features").on("click", ".feature-control", this._onClickFeatureControl.bind(this));
  }


  /**
   * Listen for click events on an attribute control to modify the composition of features in the sheet
   * @param {MouseEvent} event    The originating left click event
   * @private
   */
  async _onClickFeatureControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;
    const attrs = this.object.data.data.features;
    const form = this.form;

    // Add new attribute
    if (action === "create") {
      const nk = Object.keys(attrs).length + 1;
      let newKey = document.createElement("div");
      newKey.innerHTML = `<input type="text" name="data.features.feat${nk}.key" value="feat${nk}"/>`;
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

    // Handle the free-form features list
    const formAttrs = expandObject(formData).data.features || {};
    const features = Object.values(formAttrs).reduce((obj, v) => {
      let k = v["key"].trim();
      if (/[\s\.]/.test(k)) return ui.notifications.error("Attribute keys may not contain spaces or periods");
      delete v["key"];
      obj[k] = v;
      return obj;
    }, {});

    // Remove features which are no longer used
    for (let k of Object.keys(this.object.data.data.features)) {
      if (!features.hasOwnProperty(k)) features[`-=${k}`] = null;
    }

    // Re-combine formData
    formData = Object.entries(formData).filter(e => !e[0].startsWith("data.features")).reduce((obj, e) => {
      obj[e[0]] = e[1];
      return obj;
    }, {
      _id: this.object._id,
      "data.features": features
    });

    // Update the Item
    return this.object.update(formData);
  }
}