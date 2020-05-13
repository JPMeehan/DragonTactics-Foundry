/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export class DragonTacticsActorSheet extends ActorSheet {
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Activate tabs
    let tabs = html.find('.tabs');
    let initial = this._sheetTab;
    new Tabs(tabs, {
      initial: initial,
      callback: clicked => this._sheetTab = clicked.data("tab")
    });

    // Bloody
    if (this.actor.data.data.health.value <= (this.actor.data.data.health.max + this.actor.data.data.health.tempmax) / 2) {
      html.find('.healthvalue').addClass('bloody');
    }
    else {
      html.find('.healthvalue').removeClass('bloody');
    }

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    html.find('.defense-edit').click(ev => {
      html.find('.defense-config').toggleClass('show')
    });

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

  }

  

  getData() {
    const data = super.getData();
    
    // Prepare items.
    if (this.actor.data.type == 'hero') {
      this._prepareHeroItems(data);
    }

    return data;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareHeroItems(sheetData) {
    const actorData = sheetData.actor.data;

    // Initialize containers.
    const cls = [];
    // const equipment = { // armor, implement, supplies, weapon
    //   "armor": [],
    //   "worn": [],
    //   "carried": [],
    //   "home": []
    // };
    const features = { // feature
      "race": [],
      "class": [],
      "feat": [],
      "flaw": [],
      "competency": []
    };
    const powers = []; // power
    // const rituals = []; // ritual (need to add to sheet)

    // Iterate through items, allocating to containers
    for (let i of sheetData.items) {
      let item = i.data;
      i.img = i.img || DEFAULT_TOKEN;

      if (i.type === 'class') {
        actorData.class.name = i.name;
        actorData.class._id = i._id;
        for (let [key, value] of Object.entries(item.defense)) {
          actorData.class.defense[key] = value;
        }
      }
      else if (i.type === 'race') {
        actorData.race.name = item.name;
        actorData.race._id = item._id;
      }
      else if (i.type === 'feature') features[item.data.type].push(i);
      else if (i.type === 'powers') powers.push(i);
      // else if (i.type === 'ritual') rituals.push(i);
    }

    for (let c of cls) {
      if (c != cls[cls.length-1]) this.actor.deleteOwnedItem(c._id)
    }

    // Assign and return
    try {
      
    }
    catch (e) {
      console.log("No class assigned")
    }
    actorData.powers = powers;
    actorData.features = features;
    // actorData.equipment.rituals = rituals;

  }
}