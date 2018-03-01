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
  context.strokeStyle = '#222'
  context.beginPath()
  context.arc(origin.x, origin.y, radius, 0, 2 * Math.PI)
  context.stroke()
  context.fillStyle = '#fff'
  context.fill()
}

function Label(origin, text) {
  context.fillStyle = '#222'
  context.font = '16px sans-serif'
  context.textAlign = 'center'
  context.fillText(text, origin.x, origin.y + (Rnode * 2))
}

function Line(origin, end) {
  context.strokeStyle = '#aaa'
  context.beginPath()
  context.moveTo(origin.x, origin.y)
  context.lineTo(end.x, end.y)
  context.stroke()
}

function Link(node, connectedNode, origin, end) {
  function Arc(bezierX, bezierY) {
    context.arcTo(bezierX, bezierY, end.x, end.y, R * node.circle)
  }

  function isSameCircle() {
    return node.circle == connectedNode.circle
  }

  function isDifferentCircle() {
    return !isSameCircle()
  }

  function isPolarFlow() {
    return (node.point == 'N' && connectedNode.point == 'W') || 
           (node.point == 'N' && connectedNode.point == 'E') || 
           (node.point == 'S' && connectedNode.point == 'W') ||
           (node.point == 'S' && connectedNode.point == 'E')
           
  }

  function isEquatorialFlow() {
    return (node.point == 'W' && connectedNode.point == 'S') || 
           (node.point == 'E' && connectedNode.point == 'S') || 
           (node.point == 'W' && connectedNode.point == 'N') || 
           (node.point == 'E' && connectedNode.point == 'N')
  }

  context.strokeStyle = '#aaa'
  context.beginPath()
  context.moveTo(origin.x, origin.y)

  if(isDifferentCircle()) {
    context.lineTo(end.x, end.y)
  }

  if(isSameCircle()) {
    if(isPolarFlow()) {
      new Arc(end.x, origin.y)
    }

    if(isEquatorialFlow()) {
      new Arc(origin.x, end.y)
    }

    if(node.point == 'NE' && connectedNode.point == 'NW') {
      new Arc(origin.x - (origin.x - end.x)/2, origin.y - R * node.circle/Math.sqrt(2))
    }

    if(node.point == 'SW' && connectedNode.point == 'NW') {
      new Arc(origin.x - R * node.circle/Math.sqrt(2), origin.y - (origin.y - end.y)/2)
    }

    if(node.point == 'NW' && connectedNode.point == 'NE') {
      new Arc(end.x - (end.x - origin.x)/2, origin.y - R * node.circle/Math.sqrt(2))
    }

    if(node.point == 'SE' && connectedNode.point == 'NE') {
      new Arc(origin.x + R * node.circle/Math.sqrt(2), origin.y - (origin.y - end.y)/2)
    }

    if(node.point == 'SW' && connectedNode.point == 'SE') {
      new Arc(origin.x + (end.x - origin.x)/2, origin.y + R * node.circle/Math.sqrt(2))
    }

    if(node.point == 'SE' && connectedNode.point == 'SW') {
      new Arc(origin.x - (origin.x - end.x)/2, origin.y + R * node.circle/Math.sqrt(2))
    }

    if(node.point == 'NW' && connectedNode.point == 'SW') {
      new Arc(end.x - R * node.circle/Math.sqrt(2), end.y - (end.y - origin.y)/2)
    }

    if(node.point == 'NE' && connectedNode.point == 'SE') {
      new Arc(origin.x + R * node.circle/Math.sqrt(2), end.y - (end.y - origin.y)/2)
    }

    if((node.point == 'S' && connectedNode.point == 'SW') || (node.point == 'N' && connectedNode.point == 'NE') || (node.point == 'N' && connectedNode.point == 'NW') || (node.point == 'S' && connectedNode.point == 'SE')) {
      new Arc((origin.x - (origin.x - end.x)/2), origin.y)
    }

    if((node.point == 'SW' && connectedNode.point == 'W') || (node.point == 'NE' && connectedNode.point == 'E') || (node.point == 'NW' && connectedNode.point == 'W') || (node.point == 'SE' && connectedNode.point == 'E')) {
      new Arc(end.x, (origin.y - (origin.y - end.y)/2))
    }

    if((node.point == 'W' && connectedNode.point == 'NW') || (node.point == 'W' && connectedNode.point == 'SW') || (node.point == 'E' && connectedNode.point == 'NE') || (node.point == 'E' && connectedNode.point == 'SE')) {
      new Arc(origin.x, (origin.y - (origin.y - end.y)/2))
    }

    if((node.point == 'NW' && connectedNode.point == 'N') || (node.point == 'SW' && connectedNode.point == 'S') || (node.point == 'SE' && connectedNode == 'S') || (node.point == 'NE' && connectedNode.point == 'N')) {
      new Arc((origin.x - (origin.x - end.x)/2), end.y)
    }
  }

  context.stroke()
}

const Node = function(id, name, location, connected = []) {
  this.id = id
  this.name = name
  this.circle = location.split(" ")[0]
  this.point = location.split(" ")[1]
  this.location = new Location(this.circle, this.point)
  this.connected = connected
}

const Location = function(circle, point) {
  const lookup = {
    'N':  new Coordinate(centerWidth, centerHeight - (R * circle)),
    'NE': new Coordinate(centerWidth + ((R * circle) * Math.cos(Math.PI / 4)), centerHeight - ((R * circle) * Math.sin(Math.PI / 4))),
    'E':  new Coordinate(centerWidth + (R * circle), centerHeight),
    'SE': new Coordinate(centerWidth + (R * circle * Math.cos(Math.PI / 4)), centerHeight + (R * circle * Math.sin(Math.PI / 4))),
    'S':  new Coordinate(centerWidth, centerHeight + (R * circle)),
    'SW': new Coordinate(centerWidth - ((R * circle) * Math.cos(Math.PI / 4)), centerHeight + ((R * circle) * Math.sin(Math.PI / 4))),
    'W':  new Coordinate(centerWidth - (R * circle), centerHeight),
    'NW': new Coordinate(centerWidth - ((R * circle) * Math.cos(Math.PI / 4)), centerHeight - ((R * circle) * Math.sin(Math.PI / 4)))
  }

  if(circle == '0') {
    return new Coordinate(centerWidth, centerHeight)
  }

  return lookup[point]
}

const Graph = function(nodes) {
  this.nodes = nodes

  connectedNodes = (node) => {
    if(node.connected.length == 0) {
      return []
    }

    return this.nodes.filter(potentialConnectedNode => node.connected.includes(potentialConnectedNode.id))
  }

  this.layout = () => {
    this.nodes.forEach((node) => {
      connectedNodes(node).forEach((connectedNode) => {
        new Link(node, connectedNode, node.location, connectedNode.location)
      })
    })

    this.nodes.forEach((node) => {
      new Circle(node.location, Rnode)
      new Label(node.location, node.name)
    })
  }
}

const TOPIC_DATA = [ 
  { id: 1, name: '1', location: '1 NW', connected: [4] },
  { id: 2, name: '2', location: '1 NE', connected: [1] },
  { id: 3, name: '3', location: '1 SE', connected: [2] },
  { id: 4, name: '4', location: '1 SW', connected: [3] },
  { id: 5, name: '5', location: '2 NW', connected: [6] },
  { id: 6, name: '6', location: '2 NE', connected: [7] },
  { id: 7, name: '7', location: '2 SE', connected: [8] },
  { id: 8, name: '8', location: '2 SW', connected: [5] },
  { id: 9, name: '9', location: '3 NW', connected: [10] },
  { id: 10, name: '10', location: '3 NE', connected: [11] },
  { id: 11, name: '11', location: '3 SE', connected: [12] },
  { id: 12, name: '12', location: '3 SW', connected: [9] },

  { id: 13, name: '13', location: '4 N', connected: [14] },
  { id: 14, name: '14', location: '4 W', connected: [15] },
  { id: 15, name: '15', location: '4 SE', connected: [16] },
  { id: 16, name: '16', location: '4 SW', connected: [13] },
]

const NODES = TOPIC_DATA.map(nodeData => new Node(nodeData.id, nodeData.name, nodeData.location, nodeData.connected))

graph = new Graph(NODES)

graph.layout()
