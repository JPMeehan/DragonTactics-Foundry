

export class DragonTacticsItem extends Item {
    prepareData() {
        super.prepareData();

        const actorData = this.data;
        const data = actorData.data;
        
        if ( actorData.type === "equipment" ) this._prepareEquipmentData(actorData);

    }

    _prepareEquipmentData(actorData) {
        const data = actorData.data;
       
        data.is.weapon = false;
        data.is.armor = false;
        data.is.shield = false;

        if (data.type === "weapons") {data.is.weapon = true}
        else if (data.type === "armor") {data.is.armor = true}
        else if (data.type === "arms") {data.is.shield = true}
    }
}