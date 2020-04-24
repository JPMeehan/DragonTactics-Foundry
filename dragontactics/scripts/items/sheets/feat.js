/**
 * Extend the DragonTacticsItemSheet for feats
 * @extends {DragonTacticsItemSheet}
 */

import {
    DragonTacticsItemSheet
} from "./item-sheet.js"

export class DragonTacticsItemSheet_feat extends DragonTacticsItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["dragontactics", "sheet", "item"],
            template: "systems/dragontactics/templates/items/feat.html",
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