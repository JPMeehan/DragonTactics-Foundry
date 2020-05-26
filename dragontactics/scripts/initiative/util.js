
export async function createActionCardTable(rebuild, cardpack) {
    let packName = game.settings.get('dragontactics', 'cardDeck');
    if (cardpack) {
        packName = cardpack;
    }
    const cardPack = game.packs.get(packName);
    const cardPackIndex = await cardPack.getIndex();
    let cardTable = game.tables.getName(CONFIG.DRAGONTACTICS.init.cardTable);
    //If the table doesn't exist, create it
    if (!cardTable) {
        const tableData = {
            name: CONFIG.DRAGONTACTICS.init.cardTable,
            replacement: false,
            displayRoll: false,
            description: 'Action Card',
        };
        const tableOptions = { temporary: false, renderSheet: false };
        cardTable = await RollTable.create(tableData, tableOptions);
    }
    //If it's a rebuild call, delete all entries and then repopulate them
    if (rebuild) {
        let deletions = cardTable.results.map(i => i._id);
        await cardTable.deleteEmbeddedEntity('TableResult', deletions);
    }
    const createData = [];
    for (let i = 0; i < cardPackIndex.length; i++) {
        let c = cardPackIndex[i];
        let resultData = {
            type: 2,
            text: c.name,
            img: c.img,
            collection: packName,
            resultId: c.id,
            weight: 1,
            range: [i + 1, i + 1]
        };
        createData.push(resultData);
    }
    await cardTable.createEmbeddedEntity('TableResult', createData);
    await cardTable.normalize();
    ui.tables.render();
}
