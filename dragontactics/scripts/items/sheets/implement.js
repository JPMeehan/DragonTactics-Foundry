/**
 * Extend the DragonTacticsItemSheet for implements
 * @extends {DragonTacticsItemSheet}
 */

import {
    DragonTacticsItemSheet
} from "./item-sheet.js"

export class DragonTacticsItemSheet_implement extends DragonTacticsItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dragontactics", "sheet", "item"],
            template: "systems/dragontactics/templates/items/implement.html",
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