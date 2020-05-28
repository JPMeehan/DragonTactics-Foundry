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
            if (value === "equipment") {
                var filedata = await fetch("systems/dragontactics/assets/packjson/mundaneEquipment.json")
            }
            else if (value === "classes") {
                var filedata = await fetch("systems/dragontactics/assets/packjson/classes.json")
            }
            else if (value === "powers") {
                var filedata = await fetch("systems/dragontactics/assets/packjson/basicpowers.json")
            }
            else if (value === "races") {
                var filedata = await fetch("systems/dragontactics/assets/packjson/races.json")
            }
            else if (value === "rituals") {
                var filedata = await fetch("systems/dragontactics/assets/packjson/foundryrituals.json") //
            }
            else if (value === "feats") {
                var filedata = await fetch("systems/dragontactics/assets/packjson/feats-level1.json")
            }
            else if (value === "competencies") {
                var filedata = await fetch("systems/dragontactics/assets/packjson/competencies.json") //
            }
            else if (value === "flaws") {
                var filedata = await fetch("systems/dragontactics/assets/packjson/flaws.json");
            }
            const content = await filedata.json();
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
