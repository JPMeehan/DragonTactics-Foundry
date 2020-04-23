import {
    DragonTacticsItemSheet
} from "./item-sheet"

export class DragonTacticsItem_race extends DragonTacticsItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dragontactics", "sheet", "item"],
            template: "systems/dragontactics/templates/items/race.html",
            width: 520,
            height: 480,
            tabs: [{
                navSelector: ".sheet-tabs",
                contentSelector: ".sheet-body",
                initial: "description"
            }]
        });
    }
}