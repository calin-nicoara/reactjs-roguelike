var React = require('react');
var DungeonContainer = require('../containers/DungeonContainer');

require('../styles/main.sass');

class MainContainer extends React.Component {
  constructor() {
    super();

  }
  render() {
    return (
      <div>
        <DungeonContainer />
      </div>
    )
  }
}

module.exports = MainContainer;