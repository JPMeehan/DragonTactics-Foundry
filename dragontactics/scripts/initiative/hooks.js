Hooks.on('renderCombatTracker', (app, html, data) => {
  const currentCombat = data.combats[data.currentIndex - 1];
  html.find('.combatant').each((i, el) => {
      const combId = el.getAttribute('data-combatant-id');
      const combatant = currentCombat.data.combatants.find(c => c._id == combId);
      $(el).toggleClass("bloodied", combatant.actor.data.data.health.value <= combatant.actor.data.data.health.bloodied)
      if (combatant){
        if (combatant.hasRolled) {
            el.getElementsByClassName('token-initiative')[0].innerHTML = `<span class="initiative">${combatant.flags.dragontactics.cardString}</span>`;
        }
      }
  });
});


Hooks.on('preUpdateCombat', async (combat, updateData, options, userId) => {
  // Return early if we are NOT a GM OR we are not the player that triggered the update AND that player IS a GM
  const user = game.users.get(userId, { strict: true });
  if (!game.user.isGM || (game.userId !== userId && user.isGM)) {
      return;
  }
  // Return if this update does not contains a round
  if (!updateData.round) {
      return;
  }
  if (combat instanceof CombatEncounters) {
      combat = game.combats.get(updateData._id, { strict: true });
  }
  // If we are not moving forward through the rounds, return
  if (updateData.round < 1 || updateData.round < combat.previous.round) {
      return;
  }
  // If Combat has just started, return
  if ((!combat.previous.round || combat.previous.round === 0) && updateData.round === 1) {
      return;
  }
  let jokerDrawn = false;
  // Reset the Initiative of all combatants
  combat.combatants.forEach((c) => {
      if (c.flags.dragontactics && c.flags.dragontactics.hasJoker) {
          jokerDrawn = true;
      }
  });
  const resetComs = combat.combatants.map(c => {
      c.initiative = null;
      c.hasRolled = false;
      c.flags.dragontactics.cardValue = null;
      c.flags.dragontactics.suitValue = null;
      c.flags.dragontactics.hasJoker = null;
      return c;
  });
  updateData.combatants = resetComs;
  // Reset the deck if any combatant has had a Joker	
  if (jokerDrawn) {
      const deck = game.tables.getName(CONFIG.DRAGONTACTICS.init.cardTable);
      await deck.reset();
      ui.notifications.info('Card Deck automatically reset');
  }
  //Init autoroll
  if (game.settings.get('dragontactics', 'autoInit')) {
      const combatantIds = combat.combatants.map(c => c._id);
      await combat.rollInitiative(combatantIds);
  }
});