/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export class DragonTacticsActorSheet extends ActorSheet {
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Bloody
    if (this.actor.data.data.health.value <= (this.actor.data.data.health.max + this.actor.data.data.health.tempmax) / 2) {
      html.find('.healthvalue').addClass('bloody');
    }
    else {
      html.find('.healthvalue').removeClass('bloody');
    }



    // Showing and hiding powers
    html.find('.item-details-toggle').click(this._showItemDescription.bind(this));
    // html.find('.powerheader').click(ev => {
    //   $(ev.currentTarget).toggleClass('show');
    // })


    // console.log(html.find('input[type="radio"]'))
    // try {
    //   html.find('input[type="radio"]').change(this._radioFix.bind(this));
    //   } catch (e) {console.log("No radio inputs available")}

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
    const features = this.actor.data.data.features[itemType];
    delete features[itemId];
    this.actor.update({[`data.features.${itemType}`] : features})
  }

  _deletePower(itemId) {
    const powers = this.actor.data.data.powers;
    delete powers[itemId];
    this.actor.update({"data.powers" : powers});
  }

  _deleteEquipment(itemId, itemType) {
    const equipment = this.actor.data.data.equipment.worn[itemType];
    delete equipment[itemId];
    this.actor.update({[`data.equipment.worn.${itemType}`] : equipment});
  }

  _radioFix(event) {
    event.preventDefault();    
    let name = event.target.name;
    if ( form[name] instanceof RadioNodeList ) {
      const inputs = Array.from(form[name]);
      let values = "";
      values = inputs.map(i => i.checked ? i.value : false).filter(i => i);
      this.actor.update({[`${name}`] : values[0]})
    }
  }

//   <div class="individual-description save-toggle">
//    <span>Hello!</span>
//   </div>

  _showItemDescription(event) {
    event.preventDefault();

    var item = $(event.currentTarget).closest("li.item")
    
    
    const description = item.find(".individual-description");
  
    $(description).slideToggle(function() {
      $(this).toggleClass("open");
    });
  }
  
  async _render(force = false, options = {}) {
    this._saveToggleState();
  
    await super._render(force, options);
  
    this._setToggleState();
  }
  
  _saveToggleState() {
    if (this.form === null)
      return;
    
    const html = $(this.form).parent();
  
    this.toggleState = [];
  
    let items = $(html.find(".save-toggle"));
  
    for (let item of items)
      this.toggleState.push($(item).hasClass("open"));
  }
  
  _setToggleState() {
    if (this.toggleState) {
      const html = $(this.form).parent();
  
      let items = $(html.find(".save-toggle"));
  
      for (let i = 0; i < items.length; i++) {
        if (this.toggleState[i])
          $(items[i]).show().addClass("open");
        else
          $(items[i]).hide().removeClass("open");
      }
    }
  }
}