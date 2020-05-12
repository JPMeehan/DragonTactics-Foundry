/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export class DragonTacticsActorSheet extends ActorSheet {

  // prepareData() {
  //   super.prepareData();
  //   const actorData = this.data;
  //   const data = actorData.data;
  //   //everything below here is where you put your derived values code, if you want it to do it for ALL ACTORS. If you want to limit it to a particular actor type add:

  //   //if (actorData.type === "character") {
  //   //}
  // }

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
  }
}