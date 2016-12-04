var React = require('react');
var Dungeon = require('../components/Dungeon');

function PlayerStats(props) {
  return <div className="playerStats">
    Health: {props.heroState.health}  Weapon: {props.heroState.weapon} Attack: {props.heroState.attack}  Level: {props.heroState.level} Next Level: 100 XP Dungeon: {props.heroState.dungeon}
  </div>
}

class DungeonContainer extends React.Component {
  constructor() {
    super();

    this.keyboardCodes = {
      37: 'KEY_LEFT',
      38: 'KEY_UP',
      39: 'KEY_RIGHT',
      40: 'KEY_DOWN'
    };

    this.gridStates = {
      EMPTY: {
        value: 1,
        className: 'grid-square-empty'
      },
      WALL: {
        value: 2,
        className: 'grid-square-wall'
      },
      HERO: {
        value: 3,
        className: 'grid-square-hero'
      },
      ENEMY: {
        value: 4,
        className: 'grid-square-enemy'
      },
      HEALTH: {
        value: 5,
        className: 'grid-square-health'
      },
      WEAPON: {
        value: 6,
        className: 'grid-square-weapon'
      },
      BOSS: {
        value: 7,
        className: 'grid-square-boss'
      },
      PORTAL: {
        value: 8,
        className: 'grid-square-portal'
      }
    };

    this.length = 20;
    this.height = 20;

    this.heroCoord = {
      x: 1,
      y: 1
    };

    this.enemyCoord = {
      x: 4,
      y: 3,
    };

    this.healthCoord = {
      x: 6,
      y: 7
    };

    this.weaponCoord = {
      x: 1,
      y: 4
    };

    this.portalCoord = {
      x: 3,
      y: 9,
    };

    this.gridGeneratorOptions = {
      minRooms: 18,
      maxRooms: 25,
      minRoomLength: 10,
      maxRoomLength: 40
    };

    const grid = [];

    let enemyData = {
      health: 100,
      attack: 4
    };

    let healthData = {
      health: 200
    };

    let weaponData = {
      attack: 30,
      weapon: 'sword 1'
    };

    for(let heightIndex = 0; heightIndex < this.height; heightIndex++) {
      grid[heightIndex] = [];
      for(let lengthIndex = 0; lengthIndex < this.length; lengthIndex++) {
        let currentGridSquare;
        if(heightIndex === 0 || heightIndex === this.height-1 || lengthIndex === 0 || lengthIndex === this.length-1) {
          currentGridSquare = { state: this.gridStates.WALL};
        } else if(heightIndex === this.heroCoord.y && lengthIndex === this.heroCoord.x) {
          currentGridSquare = { state: this.gridStates.HERO };
        } else if(heightIndex === this.enemyCoord.y && lengthIndex === this.enemyCoord.x){
          currentGridSquare = { state: this.gridStates.ENEMY, data: enemyData};
        } else if(heightIndex === this.healthCoord.y && lengthIndex === this.healthCoord.x){
          currentGridSquare = { state: this.gridStates.HEALTH, data: healthData };
        } else if(heightIndex === this.weaponCoord.y && lengthIndex === this.weaponCoord.x){
          currentGridSquare = { state: this.gridStates.WEAPON, data: weaponData };
        } else if(heightIndex === this.portalCoord.y && lengthIndex === this.portalCoord.x){
          currentGridSquare = { state: this.gridStates.PORTAL };
        } else {
          currentGridSquare = { state: this.gridStates.EMPTY };
        }
        grid[heightIndex][lengthIndex] = currentGridSquare;
      }
    }

    this.state = {
      grid: grid,
      heroState: {
        health: 300,
        weapon: 'stick',
        attack: 14,
        level: 0,
        dungeon: 0
      }
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.showRow = this.showRow.bind(this);
    this.gameover = this.gameover.bind(this);
    this.occupySquare = this.occupySquare.bind(this);
  }
  gameover() {

  }
  occupySquare(newHeroPosition) {
    this.state.grid[this.heroCoord.x][this.heroCoord.y] = {state: this.gridStates.EMPTY };
    this.state.grid[newHeroPosition.x][newHeroPosition.y] = { state: this.gridStates.HERO };
    this.heroCoord = JSON.parse(JSON.stringify(newHeroPosition));
  }
  handleKeyDown(event) {
    let keyPress = this.keyboardCodes[event.keyCode];
    const newHeroPosition = JSON.parse(JSON.stringify(this.heroCoord));

    if(!!keyPress) {
      switch(keyPress) {
        case 'KEY_LEFT':
          --newHeroPosition.y;
          break;
        case 'KEY_UP':
          --newHeroPosition.x;
          break;
        case 'KEY_RIGHT':
          ++newHeroPosition.y;
          break;
        case 'KEY_DOWN':
          ++newHeroPosition.x;
          break;
      }

      let newGridSquare = this.state.grid[newHeroPosition.x][newHeroPosition.y];
      const heroState = this.state.heroState;

      if(newGridSquare.state.value === this.gridStates.EMPTY.value) {
        this.occupySquare(newHeroPosition, newHeroPosition);
      } else if(newGridSquare.state.value == this.gridStates.ENEMY.value) {
        heroState.health -= newGridSquare.data.attack;
        newGridSquare.data.health -= heroState.attack;

        if(heroState.health <= 0) {
          this.gameover();
        } else if(newGridSquare.data.health <= 0) {
          this.state.grid[newHeroPosition.x][newHeroPosition.y] = {state: this.gridStates.EMPTY };
        }
      } else if(newGridSquare.state.value == this.gridStates.WEAPON.value) {
        heroState.weapon = newGridSquare.data.weapon;
        heroState.attack = newGridSquare.data.attack;

        this.occupySquare(newHeroPosition);
      } else if(newGridSquare.state.value == this.gridStates.HEALTH.value) {
        heroState.health += newGridSquare.data.health;

        this.occupySquare(newHeroPosition);
      }

      this.setState(this.state);
    }
  }
  showRow(gridRow, rowIndex) {
    return gridRow.map((gridSquare, columnIndex) => {
      return (
        <div className={gridSquare.state.className + ' grid-square'} key={rowIndex + this.length * columnIndex }></div>
      )
    })
  }
  render() {
    return (
      <div className="container display">
        <PlayerStats heroState={this.state.heroState}/>
        <div tabIndex='0' onKeyDown={this.handleKeyDown} className='dungeon'>
          {
            this.state.grid.map( (gridRow, rowIndex) =>
              <div className="row" key={rowIndex}>{this.showRow(gridRow, rowIndex)}</div>
            )
          }
        </div>
      </div>
    )
  }
}

module.exports = DungeonContainer;