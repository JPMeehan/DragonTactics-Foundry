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
            var filedata;
            if (value === "equipment") {
                filedata = await fetch("systems/dragontactics/assets/packjson/mundaneEquipment.json")
            }
            if (value === "classes") {
                filedata = await fetch("systems/dragontactics/assets/packjson/classes.json")
            }
            if (value === "powers") {
                filedata = await fetch("systems/dragontactics/assets/packjson/basicpowers.json")
            }
            if (value === "races") {
                filedata = await fetch("systems/dragontactics/assets/packjson/races.json")
            }
            if (value === "rituals") {
                filedata = await fetch("systems/dragontactics/assets/packjson/foundryrituals.json") //
            }
            if (value === "feats") {
                filedata = await fetch("systems/dragontactics/assets/packjson/feats-level1.json")
            }
            if (value === "competencies") {
                filedata = await fetch("systems/dragontactics/assets/packjson/competencies.json") //
            }
            if (value === "flaws") {
                filedata = await fetch("systems/dragontactics/assets/packjson/flaws.json");
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
