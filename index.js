const Coordinate = function(x, y) {
  this.x = x
  this.y = y
}

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const centerWidth = window.innerWidth / 2
const centerHeight = window.innerHeight / 2
const center = new Coordinate(centerWidth, centerHeight)

context.canvas.width = window.innerWidth
context.canvas.height = window.innerHeight

var R = 100
var Rnode = 20

function Circle(origin, radius) {
  context.beginPath()
  context.arc(origin.x, origin.y, radius, 0, 2*Math.PI)
  context.stroke()
  context.fillStyle = '#fff'
  context.fill()
}

function Text(origin, text) {
  context.fillStyle = '#222'
  context.font = '16px sans-serif'
  context.textAlign = 'center'
  context.fillText(text, origin.x, origin.y + (Rnode * 2))
}

function Line(origin, end) {
  context.beginPath()
  context.moveTo(origin.x, origin.y)
  context.lineTo(end.x, end.y)
  context.stroke()
}

// axes //

// new Circle(center, 0)
// new Circle(center, R * 2)
// new Circle(center, R)

// new Line(center, new Coordinate(centerWidth, centerHeight - (R * 3)))
// new Line(center, new Coordinate(centerWidth, centerHeight + (R * 3)))
// new Line(center, new Coordinate(centerWidth - (R * 3), centerHeight))
// new Line(center, new Coordinate(centerWidth + (R * 3), centerHeight))

// new Line(center, new Coordinate(centerWidth - (R * 3), centerHeight - (R * 3)))
// new Line(center, new Coordinate(centerWidth + (R * 3), centerHeight + (R * 3)))
// new Line(center, new Coordinate(centerWidth - (R * 3), centerHeight + (R * 3)))
// new Line(center, new Coordinate(centerWidth + (R * 3), centerHeight - (R * 3)))

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        if (!map.has(key)) {
            map.set(key, [item]);
        } else {
            map.get(key).push(item);
        }
    });
    return map;
}

function zip (arr1, arr2) {
  return arr1.map(function(element, index) {
    return [element, arr2[index]];
  });
}

const Node = function(id, name) {
  this.id = id
  this.name = name
}

const Graph = function(nodes) {
  this.locations = [
    new Coordinate(centerWidth, centerHeight),      // center
    new Coordinate(centerWidth, centerHeight - R),  // C1 north
    new Coordinate(centerWidth - R, centerHeight),  // C1 west
    new Coordinate(centerWidth, centerHeight + R),  // C1 south
    new Coordinate(centerWidth + R, centerHeight),  // C1 east
    new Coordinate(centerWidth + (R * 2), centerHeight), // C2 east
    new Coordinate(centerWidth + (R * 2 * Math.cos(Math.PI / 4)), centerHeight + (R * 2 * Math.sin(Math.PI / 4))), // C2 south east
    new Coordinate(centerWidth, centerHeight + (R * 2)), // C2 south
    new Coordinate(centerWidth - (R * 2 * Math.cos(Math.PI / 4)), centerHeight + (R * 2 * Math.sin(Math.PI / 4))), // C2 south west
    new Coordinate(centerWidth - (R * 2), centerHeight), // C2 west
    new Coordinate(centerWidth - (R * 2 * Math.cos(Math.PI / 4)), centerHeight - (R * 2 * Math.sin(Math.PI / 4))), // C2 north west
    new Coordinate(centerWidth, centerHeight - (R * 2)), // C2 north
    new Coordinate(centerWidth + (R * 2 * Math.cos(Math.PI / 4)), centerHeight - (R * 2 * Math.sin(Math.PI / 4)))  // C2 north east
  ]

  this.nodes = nodes

  setCombinations = () => {
    let combinations = []

    for (var i = 0; i < this.nodes.length; i++) {
      for (var j = 0; j < this.locations.length; j++) {
        combinations.push({ node: this.nodes[i], location: this.locations[j] });
      }
    }

    return combinations
  }

  this.combinations = setCombinations()

  draw = (combination) => {
    combination.forEach((nodeWithLocation) => {
      new Circle(nodeWithLocation.location, Rnode)
      new Text(nodeWithLocation.location, nodeWithLocation.node.name)
    })
  }

  uniqueCombination = (combinations = []) => {
    if(combinations.length == this.nodes.length) { return combinations }

    let first = combinations[0]
    let others = combinations.slice(1)
    let filtered = others.filter((nodeWithLocation) => (nodeWithLocation.node.name !== first.node.name) && (nodeWithLocation.location !== first.location))
    
    return uniqueCombination(filtered.concat(first))
  }

  this.layout = () => {
    draw(uniqueCombination(this.combinations))
  }
}

const TOPIC_DATA = [ 
  { id: 1, name: 'Arrays 1'},  
  { id: 2, name: 'Arrays 2' }, 
  { id: 3, name: 'Arrays 3' }, 
  { id: 4, name: 'Arrays 4' }, 
  { id: 5, name: 'Hashes 1' },
  { id: 6, name: 'Hashes 2' },
  { id: 7, name: 'Hashes 3' },
  { id: 8, name: 'Hashes 4' },
  { id: 9, name: 'Enumerables 1' },
  { id: 10, name: 'Enumerables 2' },
  { id: 11, name: 'Enumerables 3' },
  { id: 12, name: 'Enumerables 4' },
  { id: 13, name: 'Graphs 1' }
]

const NODES = TOPIC_DATA.map(nodeData => new Node(nodeData.id, nodeData.name))

graph = new Graph(NODES)

graph.layout()
