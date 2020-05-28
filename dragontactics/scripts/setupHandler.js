import { createActionCardTable } from "./initiative/util.js";
export class DragonTacticsSetup {
    static async setup() {
        if (!game.tables.getName(CONFIG.DRAGONTACTICS.init.cardTable)) {
            await createActionCardTable();
            ui.notifications.info('First-Time-Setup complete');
        }

        var filenames = {
            "equipment": "systems/dragontactics/assets/packjson/mundaneEquipment.json", 
            "classes": "systems/dragontactics/assets/packjson/classes.json", 
            "powers": "systems/dragontactics/assets/packjson/basicpowers.json", 
            "races": "systems/dragontactics/assets/packjson/races.json", 
            "rituals": "systems/dragontactics/assets/packjson/foundryrituals.json" , 
            "feats": "systems/dragontactics/assets/packjson/feats-level1.json", 
            "competencies": "systems/dragontactics/assets/packjson/competencies.json", 
            "flaws": "systems/dragontactics/assets/packjson/flaws.json"
        }

        for (let [type, filename] of Object.entries(filenames)) {
            var pack = game.packs.find(p => p.collection === `dragontactics.${type}`);
            fetch(filename)
                .then(response => response.json())
                .then(data => {
                    let items = []
                    for (let i of Object.values(data)) {
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
