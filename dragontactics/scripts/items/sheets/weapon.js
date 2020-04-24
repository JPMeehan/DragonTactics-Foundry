/**
 * Extend the DragonTacticsItemSheet for weapons
 * @extends {DragonTacticsItemSheet}
 */

import {
    DragonTacticsItemSheet
} from "./item-sheet.js"

export class DragonTacticsItemSheet_weapon extends DragonTacticsItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dragontactics", "sheet", "item"],
            template: "systems/dragontactics/templates/items/weapon.html",
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