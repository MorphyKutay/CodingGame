let bikeNum = +readline()
let required = +readline()


let roadNum = 4
let roads = []
while(roadNum--) {
  roads.push(readline().split('').map(c => c === '.'))
}
let roadLength = roads[0].length

/**
 * Clone an array of bikes
 * @param {Array<Object>} bikes - bikes to be clones
 * @return {Array<Object>} bikes clones
 */
let clone = (bikes) => bikes.map(b => {return {x: b.x, y: b.y, speed: b.speed}})
   
/**
 * Compute possible instructions
 * @param {Array<Object>} original - unmodified bikes current positions
 * @param {Number} required - number bikes that must survive
 * @return {Array<Object>} possible instructions, each containing fields 'instr' 
 * (the instruction) and 'bikes' (bikes new positions)
 */
let computePossiblities = (original, required) => {
  let results = []
  for (let instr of ['SPEED', 'WAIT', 'JUMP', 'DOWN', 'UP', 'SLOW']) {
    // make a copy
    let bikes = clone(original)

    if (instr === 'SPEED') {
      bikes.forEach(b => b.speed++)
    } else if (instr === 'SLOW') {
      bikes.forEach(b => b.speed--)
      if (bikes[0].speed === 0) {
        bikes = []
      }
    }
            
   
    bikes = bikes.map(bike => {
      let next = bike.x + bike.speed
      let nextLane = bike.y
      let checked = roads[bike.y].slice(bike.x, next)
      if (instr === 'UP' || instr === 'DOWN') {
        if (instr === 'UP' && bike.y === 0 || instr === 'DOWN' && bike.y === 3) {
          checked = []
          bikes = []
        } else {
          nextLane = bike.y + (instr === 'UP' ? -1 : 1)
          checked.push(...roads[nextLane].slice(bike.x, next))
        }
      }
      if (checked.some(_ => !_) && instr !== 'JUMP' || next < roadLength && !roads[nextLane][next]) {
        // fall in hole during movement or at end
        return null
      }
      bike.x = next
      bike.y = nextLane
      return bike
    }).filter(b => b)
    
    if (bikes.length >= required) {
      
      results.push({instr: instr, bikes: bikes})
    }
  } 
  return results
}

/**
 * Backtrack algorithm that computes a winning sequence of instructions
 * @param {Array{Object}} bikes - bikes positions
 * @param {Number} required - number bikes that must survive
 * @return {Array<Object>} instruction sequences ('instr' field, and 'bikes' new positions), or null if game can't be won
 */
let computeInstructions = (bikes, required) => {
  let stack = [bikes]
  let instructions = []
  while(stack.length) {
    bikes = stack[0]
   
    if (bikes.next == undefined) {
      bikes.next = computePossiblities(bikes, required)
      bikes.idx = 0
    }
    
    if (bikes[0].x >= roadLength) {
      // reach the bridge ends
      return instructions.reverse()
    } else {
      if (bikes.idx < bikes.next.length) {
        let next = bikes.next[bikes.idx++]
        stack.unshift(next.bikes)
        instructions.unshift(next.instr)
      } else {
        stack.shift()
        instructions.shift()
      }
    }
  }
  // no solution found
  return null
}

let instr = null


while (true) {
  // reads bike speed (same for all) and positions
  let speed = +readline()
  let bikes = []
  for (let i = 0; i < bikeNum; i++) {
    let [x, y, active] = readline().split(' ').map(n => +n)
    if (active) {
      bikes.push({x: x, y: y, speed: speed})
    }
  }
  

  for (let expected = bikes.length; !instr && expected >= required; expected--) {
    instr = computeInstructions(clone(bikes), expected)
  }
  
  let result = instr.shift()
  print(result ? result : 'WAIT')
}
