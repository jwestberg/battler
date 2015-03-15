var mil = require('./miltechdata.js')
var units = require('./regimentdata.js')

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
    for(var i=0; i<enabled.length; i++) {
      unit = units.regiments[enabled[i]];
      if(unit.unit_type == tech_group && unit.type == type) {
        unit.name = enabled[i];
        return unit;
      } 
    }
  } 
  return getUnit(tech_level-1, tech_group, type);
}

function getInfantry(tech_level, tech_group) {
  return getUnit(tech_level, tech_group, 'infantry')
}

console.log(getInfantry(10, "western"))