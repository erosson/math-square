/* MoMath Math Square Behavior
 *
 *        Title: pacman
 *  Description: evan's first momath square
 *    Framework: P5
 *       Author: Evan Rosson (momath@erosson.org)
 *      Created: 2018-07
 *       Status: dev
 */

import P5Behavior from 'p5beh'

let state = {
  nextDotId: 1,
  numDots: 10,
  dots: {},
  users: {},
}

const WIDTH = 576
const HEIGHT = 576
function randomPixel() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  }
}
function omit(obj0, key) {
  const obj1 = {...obj0}
  delete obj1[key]
  return obj1
}
const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
function update(state, users) {
  for (let user of users) {
    for (let dotId of Object.keys(state.dots)) {
      const dot = state.dots[dotId]
      let d = distance(user, dot)
      if (d < 10) {
        console.log('eat', user.id, dot, d)
        state = {
          ...state,
          dots: omit(state.dots, dot.id),
          users: {
            ...state.users,
            [user.id]: (state.users[user.id] || 0) + 1,
          }
        }
      }
    }
  }
  while (Object.keys(state.dots).length < state.numDots) {
    const newDot = {id: state.nextDotId, ...randomPixel()}
    console.log('newDot', newDot)
    state = {
      ...state,
      dots: {...state.dots, [newDot.id]: newDot},
      nextDotId: state.nextDotId + 1,
    }
  }
  return state
}

const pb = new P5Behavior()

// for WEBGL: pb.renderer = 'webgl';

pb.preload = function (p) {
  /* this == pb.p5 == p */
  // ...
}

pb.setup = function (p) {
  /* this == pb.p5 == p */
  /* P5Behavior already calls createCanvas for us */
  // setup here...
}

pb.draw = function (floor, p) {
  state = update(state, floor.users)
  /* this == pb.p5 == p */
  // draw here...
  this.clear();
  for (let u of floor.users) {
    pb.drawUser(u);
  }
  //this.fill(128, 128, 128, 128);
  //this.noStroke();
  //pb.drawSensors(floor.sensors);

  for (let dotId of Object.keys(state.dots)) {
    const dot = state.dots[dotId]
    this.fill(255, 255, 255)
    this.ellipse(dot.x, dot.y, 24)
  }
}

export const behavior = {
  title: "pacman",
  init: pb.init.bind(pb),
  frameRate: 'sensors',
  render: pb.render.bind(pb),
  // numGhosts: 1
};
export default behavior
