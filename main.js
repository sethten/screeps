Memory.MAX_CREEPS = 5;
Memory.WARN_RATE = 0.9; // send a warning notification when the downgrade timer has reached 90% (meaning 10% lost / ticks passed)
if(Memory.notified == undefined) // whether a notification has been sent for this instance of a downgrade timer drop
    Memory.notified = false;
Memory.REASSURE_INTERVAL = 5000;
if(Memory.ticksSinceLastAccident == undefined)
    Memory.ticksSinceLastAccident = Game.time - 13776040; // my first tick in my first room

var taskHarvest = require('task.harvest');
var taskHaul = require('task.haul');

var tasks = {
    'harvest': taskHarvest.run,
    'haul': taskHaul.run
}

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        //update task
        if(creep.memory.task == 'harvest' && creep.carry.energy == creep.carryCapacity)
            creep.memory.task = 'haul';
        if(creep.memory.task == 'haul' && creep.carry.energy == 0)
            creep.memory.task = 'harvest';
        if(!creep.memory.task) //default
            creep.memory.task = 'harvest';
        
        tasks[creep.memory.task](creep);
    }
    
    needMoreSnowflakes = Object.keys(Game.creeps).length < Memory.MAX_CREEPS;
    canCreateSnowflake = Game.spawns['Arendelle'].canCreateCreep([MOVE,MOVE,WORK,CARRY]) == OK;
    if(needMoreSnowflakes && canCreateSnowflake) {
        Game.spawns['Arendelle'].createCreep( [MOVE,MOVE,WORK,CARRY] );
    }
    
    notifications();
    
    for(var creep in Memory.creeps)
        if(Game.creeps[creep] == undefined)
            delete Memory.creeps[creep];
    
}

function notifications() {
    if(Game.rooms.W53N6.controller.ticksToDowngrade <= 10000 * Memory.WARN_RATE) {
        if(Memory.notified == false) {
            Game.notify('Room controller at level ' + Game.rooms.W53N6.controller.level + ' has a downgrade timer at ' + Game.rooms.W53N6.controller.ticksToDowngrade);
            Memory.notified = true;
        }
        Memory.ticksSinceLastAccident = 0; // ;(
    } else if(Game.rooms.W53N6.controller.ticksToDowngrade > 10000 * Memory.WARN_RATE) {
        if(Memory.notified == true) {
            Memory.notified = false;
        }
        Memory.ticksSinceLastAccident++;
    }
    
    if( Memory.ticksSinceLastAccident > 0 && (Memory.ticksSinceLastAccident % Memory.REASSURE_INTERVAL == 0) ) {
        Game.notify('Everything is A-OK 👍\nTicks since last accident: ' + Memory.ticksSinceLastAccident, 0);
    }
}
