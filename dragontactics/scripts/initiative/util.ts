export async function createActionCardTable(rebuild?: boolean, cardpack?: string): Promise<void> {
    let packName = game.settings.get('swade', 'cardDeck');
    if (cardpack) {
        packName = cardpack;
    }
    const cardPack = game.packs.get(packName) as Compendium;
    const cardPackIndex = await cardPack.getIndex() as JournalEntry[];
    let cardTable = game.tables.getName(CONFIG.SWADE.init.cardTable);

    //If the table doesn't exist, create it
    if (!cardTable) {
        const tableData = {
            name: CONFIG.SWADE.init.cardTable,
            replacement: false,
            displayRoll: false,
            description: 'Action Card',
        };
        const tableOptions = { temporary: false, renderSheet: false };
        cardTable = await RollTable.create(tableData, tableOptions) as RollTable;
    }

    //If it's a rebuild call, delete all entries and then repopulate them
    if (rebuild) {
        let deletions = cardTable.results.map(i => i._id) as string[];
        await cardTable.deleteEmbeddedEntity('TableResult', deletions);
    }

    const createData = []
    for (let i = 0; i < cardPackIndex.length; i++) {
        let c = cardPackIndex[i] as any;
        let resultData = {
            type: 2, //Set type to compendium
            text: c.name,
            img: c.img,
            collection: packName, // Name of the compendium
            resultId: c.id, //Id of the entry inside the compendium
            weight: 1,
            range: [i + 1, i + 1]
        }
        createData.push(resultData);
    }
    await cardTable.createEmbeddedEntity('TableResult', createData);
    await cardTable.normalize();
    ui.tables.render();
}
