import { createActionCardTable } from "./initiative/util.js";
export class DragonTacticsSetup {
    static async setup() {
        if (!game.tables.getName(CONFIG.DRAGONTACTICS.init.cardTable)) {
            await createActionCardTable();
            ui.notifications.info('First-Time-Setup complete');
        }

        var filenames = {
            "equipment": "systems/dragontactics/assets/packjson/mundaneEquipment.json", 
            "class": "systems/dragontactics/assets/packjson/classes.json", 
            "power": "systems/dragontactics/assets/packjson/basicpowers.json", 
            "race": "systems/dragontactics/assets/packjson/races.json", 
            "ritual": "systems/dragontactics/assets/packjson/foundryrituals.json" , 
            "feats": "systems/dragontactics/assets/packjson/feats-level1.json", 
            "competencies": "systems/dragontactics/assets/packjson/competencies.json", 
            "flaws": "systems/dragontactics/assets/packjson/flaws.json"
        }

        for (let [value, filename] of Object.entries(filenames)) {
            var pack = game.packs.find(p => p.collection === `dragontactics.${value}`);
            fetch(filename)
                .then(response => response.json())
                .then(data => {
                    let items = []
                    let type = value;
                    let dict = data;
                    if (type === ("feats" || "flaws" || "competencies")) {
                        type = "feature";
                        dict = data.data;
                    }
                    else if (type === "power") {dict = data.data}
                    for (let i of Object.values(dict)) {
                        let item = {
                            "name": i.name,
                            "type": type,
                            "data": i
                        }
                        delete item.data.name;
                        items.push(item)
                    }
                    Item.create(items, {temporary: true}).then(temp => { console.log(temp)
                        // for ( let j of temp ) {
                        //     pack.importEntity(j).then(d => console.log(`Imported Item ${j.name} into Compendium pack ${pack.collection}`))
                        // }
                    })
                });
        };
    }
}
