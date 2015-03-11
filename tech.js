var mil = require('./miltechdata.js')

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

