import chairImg from './assets/chair.png';
import consoleImg from './assets/console.png';
import frameImg from './assets/frame.png';
import stoodImg from './assets/stood.png';

import mainChairImg from './assets/main-chair.png';
import mainConsoleImg from './assets/main-console.png';
import mainFrameImg from './assets/main-frame.png';
import mainStoodImg from './assets/main-stood.png';
import mainFlowervaseImg from './assets/main-flowervase.png';

import type { CartItemData } from './types';


export const itemsInfo: { [key: string]: CartItemData } = {
    frame: {
    id: 'frame',
    title: 'Milano Linea Framento',
    description:
      'A Minimalist Fine Art Frame Featuring A Solid Oak Border, Museum-Grade Acrylic Glazing, And Elegant Mount Details.',
    price: 400,
    image: frameImg,
    mainImage: mainFrameImg,
  },
  chair: {
    id: 'chair',
    title: 'Atelier Elowen Venta Chair',
    description:
      'A contemporary Italian lounge chair featuring premium upholstery, plush cushioning, and sleek black wooden legs for exceptional comfort and timeless style.',
    price: 1200,
    image: chairImg,
    mainImage: mainChairImg,
  },

  table: {
    id: 'table',
    title: 'Vetra Console',
    description:
      'A minimalist Italian TV console with a matte white finish, open shelving, concealed storage, and elegant gold metal legs.',
    price: 2500,
    image: consoleImg,
    mainImage: mainConsoleImg,
  },
    vase: {
    id: 'vase',
    title: 'Basso Uno Stood',
    description:
      'A Handcrafted Ceramic Vase With An Organic Textured Surface, A Warm Matte Finish, And Sophisticated Silhouettes Perfect For Modern Accents.',
    price: 550,
    image: stoodImg,
    mainImage: mainStoodImg,
  },
  flora: {
    id: 'flora',
    title: 'Aura Vetro Flora',
    description:
      'A minimalist cylindrical glass vase filled with fresh green leafy twigs, suspended in crystal-clear water for a touch of organic elegance.',
    price: 350,
    image: mainFlowervaseImg,
    mainImage: mainFlowervaseImg,
  },
};
