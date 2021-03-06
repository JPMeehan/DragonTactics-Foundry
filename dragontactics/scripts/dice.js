/**
 * A standardized helper function for managing dragontactics "d20 rolls"
 *
 * Holding SHIFT, ALT, or CTRL when the attack is rolled will "fast-forward".
 * This chooses the default options of a normal attack with no bonus, Advantage, or Disadvantage respectively
 *
 * @param {Array} parts            The dice roll component parts, excluding the initial d20
 * @param {Object} data            Actor or item data against which to parse the roll
 * @param {Event|object} event     The triggering event which initiated the roll
 * @param {string} rollMode        A specific roll mode to apply as the default for the resulting roll
 * @param {string|null} template   The HTML template used to render the roll dialog
 * @param {string|null} title      The dice roll UI window title
 * @param {Object} speaker         The ChatMessage speaker to pass when creating the chat
 * @param {string|null} flavor     Flavor text to use in the posted chat message
 * @param {Boolean} fastForward    Allow fast-forward advantage selection
 * @param {Function} onClose       Callback for actions to take when the dialog form is closed
 * @param {Object} dialogOptions   Modal dialog options
 * @param {boolean} advantage      Apply advantage to the roll (unless otherwise specified)
 * @param {boolean} disadvantage   Apply disadvantage to the roll (unless otherwise specified)
 * @param {number} critical        The value of d20 result which represents a critical success
 * @param {number} fumble          The value of d20 result which represents a critical failure
 * @param {number} targetValue     Assign a target value against which the result of this roll should be compared
 *
 * @return {Promise}              A Promise which resolves once the roll workflow has completed
 */
export async function d20Roll({
    parts = [],
    data = {},
    event = {},
    rollMode = null,
    template = null,
    title = null,
    speaker = null,
    flavor = null,
    fastForward = null,
    onClose,
    dialogOptions,
    advantage = null,
    disadvantage = null,
    critical = 20,
    fumble = 1,
    targetValue = null
} = {}) {

    // Handle input arguments
    flavor = flavor || title;
    speaker = speaker || ChatMessage.getSpeaker();
    parts = parts.concat(["@bonus"]);
    rollMode = rollMode || game.settings.get("core", "rollMode");
    let rolled = false;

    // Define inner roll function
    const _roll = function (parts, adv, form = null) {

        // Determine the d20 roll and modifiers
        let nd = 1;
        let mods = "";

        // Handle advantage
        if (adv === 1) {
            nd = 2;
            flavor += ` (Advantage)`;
            mods += "kh";
        }

        // Handle disadvantage
        else if (adv === -1) {
            nd = 2;
            flavor += ` (Disadvantage)`;
            mods += "kl";
        }

        // Prepend the d20 roll
        let formula = `${nd}d20${mods}`;
        parts.unshift(formula);

        // Optionally include a situational bonus
        if (form !== null) data['bonus'] = form.bonus.value;
        if (!data["bonus"]) parts.pop();

        // Execute the roll and flag critical thresholds on the d20
        let roll = new Roll(parts.join(" + "), data).roll();

        // Flag d20 options for any 20-sided dice in the roll
        for (let d of roll.dice) {
            if (d.faces === 20) {
                d.options.critical = critical;
                d.options.fumble = fumble;
                if (targetValue) d.options.target = targetValue;
            }
        }


        // Convert the roll to a chat message and return the roll
        rollMode = form ? form.rollMode.value : rollMode;
        roll.toMessage({
            speaker: speaker,
            flavor: flavor
        }, {
            rollMode
        });
        rolled = true;
        return roll;
    };

    // Determine whether the roll can be fast-forward
    if (fastForward === null) {
        fastForward = event && (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey);
    }

    // Optionally allow fast-forwarding to specify advantage or disadvantage
    if (fastForward) {
        if (advantage || event.altKey) return _roll(parts, 1);
        else if (disadvantage || event.ctrlKey || event.metaKey) return _roll(parts, -1);
        else return _roll(parts, 0);
    }

    // Render modal dialog
    template = template || "systems/dragontactics/templates/roll-dialog.html";
    let dialogData = {
        formula: parts.join(" + "),
        data: data,
        rollMode: rollMode,
        rollModes: CONFIG.Dice.rollModes,
        config: CONFIG.DND5E
    };
    const html = await renderTemplate(template, dialogData);

    // Create the Dialog window
    let roll;
    return new Promise(resolve => {
        new Dialog({
            title: title,
            content: html,
            buttons: {
                advantage: {
                    label: "Advantage",
                    callback: html => roll = _roll(parts, 1, html[0].querySelector("form"))
                },
                normal: {
                    label: "Normal",
                    callback: html => roll = _roll(parts, 0, html[0].querySelector("form"))
                },
                disadvantage: {
                    label: "Disadvantage",
                    callback: html => roll = _roll(parts, -1, html[0].querySelector("form"))
                }
            },
            default: "normal",
            close: html => {
                if (onClose) onClose(html, parts, data);
                resolve(rolled ? roll : false)
            }
        }, dialogOptions).render(true);
    })
}

/* -------------------------------------------- */

/**
 * A standardized helper function for managing dragontactics damage rolls
 *
 * Holding SHIFT, ALT, or CTRL when the attack is rolled will "fast-forward".
 * This chooses the default options of a normal attack with no bonus, Critical, or no bonus respectively
 *
 * @param {Array} parts           The dice roll component parts
 * @param {Actor} actor           The Actor making the damage roll
 * @param {Object} data           Actor or item data against which to parse the roll
 * @param {Event|object}[event    The triggering event which initiated the roll
 * @param {string} rollMode       A specific roll mode to apply as the default for the resulting roll
 * @param {String} template       The HTML template used to render the roll dialog
 * @param {String} title          The dice roll UI window title
 * @param {Object} speaker        The ChatMessage speaker to pass when creating the chat
 * @param {string} flavor         Flavor text to use in the posted chat message
 * @param {boolean} allowCritical Allow the opportunity for a critical hit to be rolled
 * @param {Boolean} critical      Flag this roll as a critical hit for the purposes of fast-forward rolls
 * @param {string} critdie        Size of crit dice for the attack
 * @param {Boolean} highcrit      Whether the attack has the high crit property
 * @param {Boolean} fastForward   Allow fast-forward advantage selection
 * @param {Function} onClose      Callback for actions to take when the dialog form is closed
 * @param {Object} dialogOptions  Modal dialog options
 *
 * @return {Promise}              A Promise which resolves once the roll workflow has completed
 */
export async function damageRoll({
    parts,
    actor,
    data,
    quest = 0,
    event = {},
    rollMode = null,
    template,
    title,
    speaker,
    flavor,
    allowCritical = true,
    critical = false,
    critdie = "d6",
    hicrit,
    weapondie,
    fastForward = null,
    onClose,
    dialogOptions
}) {

    // Handle input arguments
    flavor = flavor || title;
    speaker = speaker || ChatMessage.getSpeaker();
    rollMode = game.settings.get("core", "rollMode");
    let rolled = false;

    // Define inner roll function

    const _roll = function (parts, crit, form) {
        data['bonus'] = form.bonus.value ? form.bonus.value : 0;
        let roll = new Roll(parts.join("+"), data);

        // Modify the damage formula for critical hits
        if (crit === true) {
            let rollmax = roll.evaluate({maximize: true})._total.toString();
            let c = hicrit ? weapondie + " + " : "";
            let q = quest ? quest + critdie + " + " : ""
            roll = new Roll(q + c + rollmax, data);
            flavor = `${flavor} (Critical Hit)`;
        }


        // Convert the roll to a chat message
        rollMode = form ? form.rollMode.value : rollMode;
        roll.toMessage({
            speaker: speaker,
            flavor: flavor
        }, {
            rollMode
        });
        rolled = true;

        return roll;
    };

    // Determine whether the roll can be fast-forward
    if (fastForward === null) {
        fastForward = event && (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey);
    }

    // Modify the roll and handle fast-forwarding
    if (fastForward) return _roll(parts, critical || event.altKey);
    else parts = parts.concat(["@bonus"]);


    // Render modal dialog
    template = template || "systems/dragontactics/templates/roll-dialog.html";
    let dialogData = {
        formula: parts.join(" + "),
        data: data,
        rollMode: rollMode,
        rollModes: CONFIG.Dice.rollModes
    };
    const html = await renderTemplate(template, dialogData);

    // Create the Dialog window
    let roll;

    return new Promise(resolve => {
        new Dialog({
            title: title,
            content: html,
            buttons: {
                critical: {
                    condition: allowCritical,
                    label: "Critical Hit",
                    callback: html => roll = _roll(parts, true, html[0].querySelector("form"))
                },
                normal: {
                    label: allowCritical ? "Normal" : "Roll",
                    callback: html => roll = _roll(parts, false, html[0].querySelector("form"))
                },
            },
            default: "normal",
            close: html => {
                if (onClose) onClose(html, parts, data);
                resolve(rolled ? roll : false);
            }
        }, dialogOptions).render(true);
    });
}