let taskHaul = {
    
    /** @param {Creep} creep **/
    run: function (creep) {
        var target;
        let needMoreSnowflakes = Object.keys(Game.creeps).length < Memory.MAX_CREEPS;
        if (needMoreSnowflakes)
            target = Game.spawns['Arendelle'];
        else
            target = Game.rooms.W53N6.controller;
        let status = creep.transfer(target, RESOURCE_ENERGY);
        if (status == ERR_NOT_IN_RANGE || status == ERR_INVALID_TARGET)
            creep.moveTo(target);
    }
};

module.exports = taskHaul;
