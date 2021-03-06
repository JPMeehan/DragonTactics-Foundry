import { d20Roll, damageRoll } from "../dice.js";

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
    
    // Showing and hiding equipment categories
    html.find('.equipment-toggle').click(this._showEquipmentCategory.bind(this));
    
    // Rollable abilities.
    html.find('.rollable.ability').click(this._onRollAbility.bind(this));
    html.find('.rollable.skill').click(this._onRollSkill.bind(this));
    html.find('.rollable.hit-damage').click(this._onRollDamage.bind(this));
    html.find('.rollable.attack').click(this._onRollAttack.bind(this))


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
      if (li.data("ritual")) {this._deleteRitual(li.data("itemId"))}
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

    html.find('.race.name').click(ev => { // render item
      try {
        this.actor.getOwnedItem(this.actor.data.data.race._id).sheet.render(true);
      }
      catch (e) {
        ui.notifications.error("This hero doesn't have a race")
      }
      
    })
  }


  _deleteFeature(itemId, itemType) {
    const features = duplicate(this.actor.data.data.features[itemType]);
    delete features[itemId];
    features["-=" + itemId] = null;
    this.actor.update({[`data.features.${itemType}`] : features})
  }

  _deletePower(itemId) {
    const powers = duplicate(this.actor.data.data.powers);
    delete powers[itemId];
    powers["-=" + itemId] = null;
    this.actor.update({"data.powers" : powers});
  }

  _showEquipmentCategory(event) {
    event.preventDefault();

    var category = $(event.currentTarget).nextUntil("a", "ol")

    $(category).slideToggle(function() {
      $(this).toggleClass("open")
    })
  }

  _deleteEquipment(itemId, itemType) {
    const equipment = duplicate(this.actor.data.data.equipment.worn[itemType]);
    delete equipment[itemId];
    equipment["-=" + itemId] = null;
    this.actor.update({[`data.equipment.worn.${itemType}`] : equipment});
  }

  _deleteRitual(itemId) {
    const rituals = duplicate(this.actor.data.data.rituals);
    delete rituals[itemId];
    rituals["-=" + itemId] = null;
    this.actor.update({"data.rituals" : rituals});
  }

  // _radioFix(event) {
  //   event.preventDefault();    
  //   let name = event.target.name;
  //   if ( form[name] instanceof RadioNodeList ) {
  //     const inputs = Array.from(form[name]);
  //     let values = "";
  //     values = inputs.map(i => i.checked ? i.value : false).filter(i => i);
  //     this.actor.update({[`${name}`] : values[0]})
  //   }
  // }

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
    this._saveScrollPos();
  
    await super._render(force, options);
  
    this._setToggleState();
  
    this._setScrollPos();
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

  _onRollAbility(event) {
    event.preventDefault();
    const ability = event.currentTarget.dataset.ability;
    this.actor.rollAbilityCheck(ability, {event: event});
  }
  _onRollSkill(event) {
    event.preventDefault();
    const skill = event.currentTarget.dataset.skill;
    this.actor.rollSkillCheck(skill, {event: event});
  }

  _onRollAttack(event) {
    event.preventDefault();
    const power = event.currentTarget.dataset.power;
    const attack = event.currentTarget.dataset.attack;
    this.actor.rollAttack(power, attack, {event: event});
  }
  _onRollDamage(event) {
    event.preventDefault();
    const power = event.currentTarget.dataset.power;
    const attack = event.currentTarget.dataset.attack;
    this.actor.rollDamage(power, attack, {event: event});
  }
  
  

  _saveScrollPos() {
    if (this.form === null)
      return;
  
    const html = $(this.form).parent();
  
    this.scrollPos = [];
  
    let lists = $(html.find(".save-scroll"));
  
    for (let list of lists) {
      this.scrollPos.push($(list).scrollTop());
    }
  }
  
  _setScrollPos() {
    if (this.scrollPos) {
      const html = $(this.form).parent();
  
      let lists = $(html.find(".save-scroll"));
  
      for (let i = 0; i < lists.length; i++) {
        $(lists[i]).scrollTop(this.scrollPos[i]);
      }
    }
  }
}