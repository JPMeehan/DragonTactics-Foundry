export const registerSettings = function () {

	game.settings.register('dragontactics', 'initiativeSound', {
		name: "Card Sound",
		hint: "Play a short card sound when dealing Initiative",
		default: true,
		scope: 'world',
		type: Boolean,
		config: true
	});

	game.settings.register('dragontactics', 'autoInit', {
		name: "Automatic Initiative",
		hint: "Automatically draw Action Cards every round",
		default: true,
		scope: 'world',
		type: Boolean,
		config: true
	});

	game.settings.register('dragontactics', 'initMessage', {
		name: "Create Chat Message for Initiative",
		default: true,
		scope: 'world',
		type: Boolean,
		config: true
	});
}
