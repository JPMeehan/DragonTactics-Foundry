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
      this.deleteFeature(li.data("itemId"), li.data("featureType"));
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
    function matchID(object) {return object["_id"] === itemId}
    const features = this.actor.data.data.features[itemType];
    const index = features.findIndex(matchID);
    features.splice(index, 1);
    actor.update({[`data.features.${itemType}`] : features})
  }
}