var terrains = require('./terrains.js')
var tech = require('./tech.js')
var _und = require('./lib/underscore.js')

function Battle(attacker, defender, terrain, crossing) {
	this.attacker = attacker; 
  this.defender = defender; 
  this.terrain = terrain;
	this.crossing = crossing;
}

function General(fire, shock, manouver, siege) {
	this.fire = fire;
	this.shock = shock;
  this.manouver = manouver;
  this.siege = siege;
}

function Country(tech_level, tech_group, discipline, max_morale) {
  this.tech_level = tech_level;
  this.tech_group = tech_group;
  this.discipline = discipline;
  this.max_morale = max_morale;
}

function Army(general, country, num_infantry, num_cavalry, num_artillery) {
  this.general = general;
  
  var ms = function(tag, regs) {
    return _und.map(regs, function(reg) {
      reg.morale = tag.max_morale;
      reg.strength = 1000;
      return reg;
    });
  };
  
  var multiply = function(object, size) {
    var array = []
    for(var i=0; i<size; i++) {
      array.push(JSON.parse(JSON.stringify(object)))
    }
    return array;
  };
  
  this.infantry = ms(country, multiply(tech.getInfantry(country.tech_level, country.tech_group), num_infantry));
  this.cavalry = ms(country, multiply(tech.getCavalry(country.tech_level, country.tech_group), num_cavalry));
  this.artillery = ms(country, multiply(tech.getArtillery(country.tech_level, country.tech_group), num_artillery));
  
  this.size = function() {
    return _und.reduce(this.infantry.concat(this.cavalry).concat(this.artillery), function(memo, unit) { 
      return memo + unit.strength; 
    }, 0)
  }
}

function roll() {
	return Math.floor((Math.random())*10)
}

function tick(battle, attacker_roll, defender_roll) {

	//attacker_roll = attacker_roll + battle.terrain.attacker_modifier + battle.crossing
}

var attacker = new Country(10, "western", 2.5, 2.5)
var defender = new Country(10, "chinese", 2.5, 2.5)
var general = new General(1,1,1,1);

console.log(new Army(general, attacker, 1, 5, 1).size())
