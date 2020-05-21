/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export class DragonTacticsActorSheet extends ActorSheet {
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Activate tabs
    // let tabs = html.find('.tabs');
    // let initial = this._sheetTab;
    // new Tabs(tabs, {
    //   initial: initial,
    //   callback: clicked => this._sheetTab = clicked.data("tab")
    // });

    // Tabs v2
    // const tabs = new TabsV2({navSelector: ".tabs", contentSelector: ".sheet-body", initial: "description"});
    // tabs.bind(html);

    // Bloody
    if (this.actor.data.data.health.value <= (this.actor.data.data.health.max + this.actor.data.data.health.tempmax) / 2) {
      html.find('.healthvalue').addClass('bloody');
    }
    else {
      html.find('.healthvalue').removeClass('bloody');
    }

    // Showing and hiding powers
    html.find('.powers .item-details-toggle').click(this._showPowerDetails.bind(this));
    // html.find('.powerheader').click(ev => {
    //   $(ev.currentTarget).toggleClass('show');
    // })

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
      if (li.data("featureType")){this._deleteFeature(li.data("itemId"), li.data("featureType"))}
      if (li.data("power")) {this._deletePower(li.data("itemId"))}
      if (li.data("equipment")) {this._deleteEquipment(li.data("itemId"), li.data("equipment"))}
      li.slideUp(200, () => this.render(false));
    });

    html.find('.class.name').click(ev => { // render item
      try {
        this.actor.getOwnedItem(this.actor.data.data.class._id).sheet.render(true);
      }
      catch (e) {
        ui.notifications.error("This hero doesn't have a class")
      }
      
    })
  }


  _deleteFeature(itemId, itemType) {
    const features = duplicate(this.actor.data.data.features[itemType]);
    delete features[itemId];
    this.actor.update({[`data.features.${itemType}`] : features})
  }

  _deletePower(itemId) {
    const powers = duplicate(this.actor.data.data.powers);
    delete powers[itemId];
    this.actor.update({"data.powers" : powers});
  }

  _deleteEquipment(itemId, itemType) {
    const equipment = duplicate(this.actor.data.data.equipment.worn[itemType]);
    delete equipment[itemId];
    this.actor.update({[`data.equipment.worn.${itemType}`] : equipment});
  }

  _showPowerDetails(event) {
    event.preventDefault();
    const toggler = $(event.currentTarget);
    const toggleIcon = toggler.find('i');
    const power = toggler.parents('.item');
    const body = power.find('.powerbody');

    if (toggleIcon.hasClass('fa-caret-right')) {
      toggleIcon.removeClass('fa-caret-right').addClass('fa-caret-down');
      body.slideDown();
    } else {
      toggleIcon.removeClass('fa-caret-down').addClass('fa-caret-right');
      body.slideUp();
    }
  }
}