import React from 'react';

function Colors({ colors }) {
  return (
    <p className="App-tags">
      { colors.map(color => <span key={color.hex}>
        <span className="App-tag" style={{ background: color.hex }}>{ color.hex }</span>
      </span>) }
    </p>
  );
}

export default Colors;
