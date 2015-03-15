var mil = require('./miltechdata.js')
var units = require('./regimentdata.js')
var _und = require('./lib/underscore.js')

function getModifiers(techLevel) {
  var modifiers = {
    infantry_fire: 0,
    infantry_shock: 0,
    cavalry_shock: 0,
    artillery_shock: 0,
    land_morale: 0,
    combat_width: 15,
    military_tactics: 0.5
  }
  for(var i=0; i<=techLevel; i++) {
    for(var modifier in modifiers) {
      if(modifiers.hasOwnProperty(modifier) && mil.miltech[i].hasOwnProperty(modifier)) {
        modifiers[modifier] += mil.miltech[i][modifier]
      }
    }
  }
  return modifiers;
}

function getUnit(tech_level, tech_group, type) {
  if(tech_level < 0) throw "Error";
  var enabled = mil.miltech[tech_level].enable;
  if(typeof enabled != 'undefined') {
    name = _und.find(enabled, function(name) {
      return (tech_group == null || units.regiments[name].unit_type == tech_group) && units.regiments[name].type == type;
    });
    if(typeof name != 'undefined') {
      unit = units.regiments[name];
      unit.name = name;
      return unit;
    }
  } 
  return getUnit(tech_level-1, tech_group, type);
}

function getInfantry(tech_level, tech_group) {
  return getUnit(tech_level, tech_group, 'infantry')
}

function getCavalry(tech_level, tech_group) {
  return getUnit(tech_level, tech_group, 'cavalry')
}

function getArtillery(tech_level, tech_group) {
  return getUnit(tech_level, null, 'artillery')
}

function count(unit) {
  return _und.reduce(Object.keys(unit), function(memo, num) { if(typeof unit[num] === 'number') return memo + unit[num]; return memo; }, 0)
}

exports.getArtillery = getArtillery
exports.getInfantry = getInfantry
exports.getCavalry = getCavalry