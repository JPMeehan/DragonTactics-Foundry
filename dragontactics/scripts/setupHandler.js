import { createActionCardTable } from "./initiative/util.js";
export class DragonTacticsSetup {
    static async setup() {
        if (!game.tables.getName(CONFIG.DRAGONTACTICS.init.cardTable)) {
            await createActionCardTable();
            ui.notifications.info('First-Time-Setup complete');
        }

        // var filenames = {
        //     "equipment": "systems/dragontactics/assets/packjson/mundaneEquipment.json", 
        //     "class": "systems/dragontactics/assets/packjson/classes.json", 
        //     "power": "systems/dragontactics/assets/packjson/basicpowers.json", 
        //     "race": "systems/dragontactics/assets/packjson/foundryraces.json", 
        //     "ritual": "systems/dragontactics/assets/packjson/foundryrituals.json" , 
        //     "feats": "systems/dragontactics/assets/packjson/feats-level1.json", 
        //     "competencies": "systems/dragontactics/assets/packjson/competencies.json", 
        //     "flaws": "systems/dragontactics/assets/packjson/flaws.json"
        // }

        // var pack = {}
        // for (let [key, filename] of Object.entries(filenames)) {
        //     let packname = key
        //     if (packname === "power") {packname = "powers"}
        //     else if (packname === "race") {packname = "races"}
        //     else if (packname === "class") {packname = "classes"}
        //     else if (packname === "ritual") {packname = "rituals"}
        //     pack[key] = game.packs.find(p => p.collection === `dragontactics.${packname}`);
        //     fetch(filename)
        //         .then(response => response.json())
        //         .then(data => {
        //             let items = []
        //             let type = key;
        //             let dict = data;
        //             if (type === "feats" || type === "flaws" || type === "competencies") {
        //                 type = "feature";
        //                 dict = data.data;
        //             }
        //             else if (type === "power") {dict = data.data}
        //             for (let i of Object.values(dict)) {
        //                 let item = {
        //                     "name": i.name,
        //                     "type": type,
        //                     "data": i
        //                 }
        //                 delete item.data.name;
        //                 items.push(item)
        //             }
        //             Item.create(items, {temporary: true}).then(temp => {
        //                 // console.log(temp)
        //                 for ( let j of temp ) {
        //                     console.log(`Attempting to import ${j.name}`)
        //                     try{pack[key].importEntity(j).then(d => console.log(`Imported into Compendium pack ${pack[key].collection} successful`))}
        //                     catch (e) {
        //                         console.log(`Failed to import`)
        //                     }
        //                 }
        //             })
        //         });
        // };
    }
}
