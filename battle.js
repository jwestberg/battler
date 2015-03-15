var terrains = require('./terrains.js')
var tech = require('./tech.js')

function Battle(attacker, defender, terrain, crossing) {
	return {
		attacker: attacker, 
		defender: defender, 
		terrain: terrain, 
		crossing: crossing
	}
}

function General(fire, shock, manouver, siege) {
	return {
		fire: fire,
		shock: shock,
		manouver: manouver,
		siege: siege
	}
}

function Army(general, tech_group, tech_level, infantry, cavalry, artillery) {
	return {
		general: general,
		regiments: multiply(tech.getInfantry(tech_level, tech_group), infantry)
                  .concat(multiply(tech.getCavalry(tech_level, tech_group), cavalry))
                  .concat(multiply(tech.getArtillery(tech_level, tech_group), artillery))
	}
}

function multiply(object, size) {
  var array = []
  for(var i=0; i<size; i++) {
    array.push(JSON.parse(JSON.stringify(object)))
  }
  return array;
}

function roll() {
	return Math.floor((Math.random())*10)
}

function tick(battle, attacker_roll, defender_roll) {

	//attacker_roll = attacker_roll + battle.terrain.attacker_modifier + battle.crossing
}

console.log(Army(General(1,1,1,1), "western", 10, 1, 1, 1))
