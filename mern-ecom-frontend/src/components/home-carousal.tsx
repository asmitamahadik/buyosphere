import React from 'react';
import { Carousel } from 'antd';
import slide1 from '/images/home-caro1.png';


const contentStyle: React.CSSProperties = {
  height: '250px',
  color: '#fff',
  lineHeight: '250px',
  textAlign: 'center',
  background: 'black', 
  backgroundSize: '100% 100%',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const HomeCarousal: React.FC = () => (
  <Carousel autoplay>
    <div>
        <div style={{...contentStyle, backgroundImage: `url(${slide1})`}} ></div>
    </div>
    <div>
        <div style={{...contentStyle, backgroundImage: `url(${slide1})`}} ></div>
    </div>
    <div>
        <div style={{...contentStyle, backgroundImage: `url(${slide1})`}} ></div>
    </div>
    <div>
        <div style={{...contentStyle, backgroundImage: `url(${slide1})`}} ></div>
    </div>
  </Carousel>
);

export default HomeCarousal;