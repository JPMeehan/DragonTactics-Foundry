/**
 * Extend the DragonTacticsItemSheet for powers
 * @extends {DragonTacticsItemSheet}
 */

import {
    DragonTacticsItemSheet
} from "./item-sheet"

export class DragonTacticsItemSheet_power extends DragonTacticsItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dragontactics", "sheet", "item"],
            template: "systems/dragontactics/templates/items/power.html",
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