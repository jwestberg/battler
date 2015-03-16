var terrains = require('./terrains.js')
var tech = require('./tech.js')
var _und = require('./lib/underscore.js')

function Battle(attacker, defender, terrain, crossing) {
	this.attacker = attacker; 
  this.defender = defender; 
  this.terrain = terrain;
	this.crossing = crossing;
  
  attacker.deploy(terrain);
  defender.deploy(terrain);
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
  this.country = country;
  
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
  
  this.firstrow = []
  this.secondrow = []
  
  this.deploy = function(terrain) {
    var width = Math.floor(tech.getModifiers(this.country.tech_level).combat_width * terrain.combat_width); //TODO: Verify floor is correct
    var firstrowreserved = 2*(Math.floor(width/10)) + 2; //TODO: Observe in the wild
    if (width-firstrowreserved < this.infantry.length) {
      for (var i = 0; i<width-firstrowreserved; i++) {
        this.firstrow[i+firstrowreserved/2] = this.infantry[i];
        this.infantry[i].deployed = true
      }
      for(var i = 0; i<firstrowreserved && i<this.cavalry.length; i++) {
        if(i%2 == 0) {
          this.firstrow[i/2] = this.cavalry[i];
        } else {
          this.firstrow[width-Math.ceil(i/2)] = this.cavalry[i];
        }
        this.cavalry[i].deployed = true;
      }
      for(var i=0; i<width; i++) {
        if(typeof this.firstrow[i] == 'undefined') {
          this.firstrow[i] = _und.find(this.infantry, function(unit) { return !unit.deployed; });
          this.firstrow[i].deployed = true;
        }
      }
    }
  };
  
  this.asciiRows = function() {
    return _und.map(this.firstrow, function(unit) { return unit.type.charAt(0); }).join('')+
      '\n'+_und.map(this.secondrow, function(unit) { return unit.type.charAt(0); }).join('')
  }
}

function roll() {
	return Math.floor((Math.random())*10)
}

function tick(battle, attacker_roll, defender_roll) {

	//attacker_roll = attacker_roll + battle.terrain.attacker_modifier + battle.crossing
}

var attacker_country = new Country(10, "western", 2.5, 2.5)
var defender_country = new Country(10, "chinese", 2.5, 2.5)
var general = new General(1,1,1,1);

var attacker_army = new Army(general, attacker_country, 1000, 2, 1);
var defender_army = new Army(general, defender_country, 5, 1, 1);
var battle = new Battle(attacker_army, defender_army, terrains.mountains, -1)

console.log(attacker_army.asciiRows())

console.log(attacker_army.asciiRows().length)