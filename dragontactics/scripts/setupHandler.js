import { createActionCardTable } from "./initiative/util.js";
export class DragonTacticsSetup {
    static async setup() {
        if (!game.tables.getName(CONFIG.DRAGONTACTICS.init.cardTable)) {
            await createActionCardTable();
            ui.notifications.info('First-Time-Setup complete');
        }
        characterCreation = ["equipment", "classes", "powers", "races", "rituals", "feats", "competencies", "flaws"]

        characterCreation.forEach((value, index, array) => {
            var pack = game.packs.find(p => p.collection === `dragontactics.${value}`);
            var response;
            if (value === "equipment") {
                response = await fetch("systems/dragontactics/assets/packjson/mundaneEquipment.json")
            }
            if (value === "classes") {
                response = await fetch("systems/dragontactics/assets/packjson/classes.json")
            }
            if (value === "powers") {
                response = await fetch("systems/dragontactics/assets/packjson/basicpowers.json")
            }
            if (value === "races") {
                response = await fetch("systems/dragontactics/assets/packjson/races.json")
            }
            if (value === "rituals") {
                response = await fetch("systems/dragontactics/assets/packjson/foundryrituals.json") //
            }
            if (value === "feats") {
                response = await fetch("systems/dragontactics/assets/packjson/feats-level1.json")
            }
            if (value === "competencies") {
                response = await fetch("systems/dragontactics/assets/packjson/competencies.json") //
            }
            if (value === "flaws") {
                response = await fetch("systems/dragontactics/assets/packjson/flaws.json");
            }
            const content = await response.json();
            let items = []
            for (let i of content["data"]) {
                let item = {
                    "name": i.name,
                    "type": value,
                    "data": i
                }
                delete item.data.name;
                items.push(item)
            }

            const temp = await Item.create(items, {temporary: true})

            for ( let j of temp ) {
                await pack.importEntity(j);
                console.log(`Imported Item ${j.name} into Compendium pack ${pack.collection}`);
            }
        });
    }
}
