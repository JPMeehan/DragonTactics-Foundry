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
  }
}