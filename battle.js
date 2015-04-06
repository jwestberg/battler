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
  
  this.select_targets = function() {}
  
  this.select_target = function(unit) {}
  
  this.tick = function(phase, attacker_roll, defender_roll) {
    
    if(phase == 'fire') {
     
    }
  }
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
  
  this.rows = []
  this.rows[0] = []
  this.rows[1] = []
  
  this._deployCavalry = function(width, cavalryreserved, row) {
    cav = _und.filter(this.cavalry, function(cav) { return !cav.deployed; })
    
    for(i = 0; i<cavalryreserved && i<cav.length; i++) {
      column = i%2 === 0 ? i/2 : width-Math.floor(i/2);
      this.deployUnit(cav[i], row, column)
    }
  }
  
  this._fillInfantry = function(width, row) {
    for(i=0; i<width; i++) {
      column = (i%2 === 0) ? Math.floor(width/2)-Math.floor(i/2) : Math.floor(width/2)+Math.ceil(i/2);
      if(typeof this.rows[row][column] == 'undefined') {
        this.rows[row][column] = _und.find(this.infantry, function(unit) { return !unit.deployed; });
        if(typeof this.rows[row][column] != 'undefined') {
          this.rows[row][column].deployed = true; 
        }
      }
    }
  }
  
  this.deploy = function(terrain) {
    var width = Math.floor(tech.getModifiers(this.country.tech_level).combat_width * terrain.combat_width); //TODO: Verify floor is correct
    var cavalryreserved = 2*(Math.floor(width/10)) + 2; //TODO: Observe in the wild
    for (i = 0; i<width-cavalryreserved && i<this.infantry.length; i++) {
      column = i%2 === 0 ? Math.floor(width/2)-i/2 : Math.floor(width/2)+Math.ceil(i/2);
      this.deployUnit(this.infantry[i], 0, column);
    }
    this._deployCavalry(width, cavalryreserved, 0)
    this._fillInfantry(width, 0)
    for (i = 0; i<width && i<this.artillery.length; i++) {
      var column = (i%2 === 0) ? Math.floor(width/2)-i/2 : Math.floor(width/2)+Math.ceil(i/2);
      if(typeof this.rows[0][column] != 'undefined' && this.rows[0][column].type == 'infantry') {
        this.deployUnit(this.artillery[i], 1, column);
      } else if (typeof this.rows[0][column] == 'undefined') {
        this.deployUnit(this.artillery[i], 0, column);
      }
    }
    this._deployCavalry(width, cavalryreserved, 1)
    this._fillInfantry(width, 1)
  };
  
  this.deployUnit = function(unit, row, column) {
    this.rows[row][column] = unit;
    unit.deployed = true;
    unit.row = row;
    unit.column =column;
  }
  
  this.asciiRows = function() {
    fr = ''
    sr = ''
    for(i = 0; i<this.rows[0].length; i++) {
      fr += typeof this.rows[0][i] != 'undefined' ? this.rows[0][i].type.charAt(0) : ' ';
      sr += typeof this.rows[1][i] != 'undefined' ? this.rows[1][i].type.charAt(0) : ' ';
    }
    return fr+'\n'+sr;
  }
  
  this.asciiRowsAttacker = function() {
    fr = ''
    sr = ''
    for(i = 1; i<=this.rows[0].length; i++) {
      fr += typeof this.rows[0][this.rows[0].length-i] != 'undefined' ? this.rows[0][this.rows[0].length-i].type.charAt(0) : ' ';
      sr += typeof this.rows[1][this.rows[1].length-i] != 'undefined' ? this.rows[1][this.rows[1].length-i].type.charAt(0) : ' ';
    }
    return sr+'\n'+fr;
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

var attacker_army = new Army(general, attacker_country, 7, 8, 100);
var defender_army = new Army(general, defender_country, 13, 100, 1);
var battle = new Battle(attacker_army, defender_army, terrains.mountains, -1)

console.log(attacker_army.asciiRowsAttacker()+'\n')
console.log(defender_army.asciiRows())