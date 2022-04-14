import React from 'react';
import Carousel from 'react-elastic-carousel';

const settings = {
  itemToShow: 1,
};

export default function cart_0() {
  return (
    <div style={{}}>
      <Carousel {...settings}>
        <div
          style={{
            display: 'flex',
            backgroundColor: 'gray',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p>1</p>
        </div>
        <div>
          <p>2</p>
        </div>
        <div>
          <p>2</p>
        </div>
      </Carousel>
    </div>
  );
}
