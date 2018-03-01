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
  function isCenter() {
    return node.circle == 0
  }

  function isSameCircle() {
    return node.circle == connectedNode.circle
  }

  function isDifferentCircle() {
    return !isSameCircle()
  }

  context.strokeStyle = '#aaa'
  context.beginPath()
  context.moveTo(origin.x, origin.y)

  if(isCenter() || isDifferentCircle()) {
    context.lineTo(end.x, end.y)
  }

  if(isSameCircle()) {
    if(node.point == 'N' && connectedNode.point == 'W') {
      context.arcTo(end.x, origin.y, end.x, end.y, R * node.circle)
    }

    if(node.point == 'W' && connectedNode.point == 'S') {
      context.arcTo(origin.x, end.y, end.x, end.y, R * node.circle)
    }

    if((node.point == 'S' && connectedNode.point == 'SW') || (node.point == 'N' && connectedNode.point == 'NE')) {
      context.arcTo((origin.x - (origin.x - end.x)/2), origin.y, end.x, end.y, R * node.circle)
    }

    if((node.point == 'SW' && connectedNode.point == 'W') || (node.point == 'NE' && connectedNode.point == 'E')) {
      context.arcTo((origin.x - (origin.x - end.x)), (origin.y - (origin.y - end.y)/2), end.x, end.y, R * node.circle)
    }

    if(node.point == 'W' && connectedNode.point == 'NW') {
      context.arcTo((end.x - (end.x - origin.x)), (origin.y - (origin.y - end.y)/2), end.x, end.y, R * node.circle)
    }

    if(node.point == 'NW' && connectedNode.point == 'N') {
      context.arcTo((origin.x - (origin.x - end.x)/2), end.y, end.x, end.y, R * node.circle)
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
  { id: 1, name: 'Arrays 1', location: '0', connected: [2, 15] },
  { id: 15, name: 'Arrays 1i', location: '1 SE', connected: [16] },
  { id: 16, name: 'Arrays 1ii', location: '2 SE' },
  { id: 2, name: 'Arrays 2', location: '1 N', connected: [3] },
  { id: 3, name: 'Arrays 3', location: '1 W', connected: [4] }, 
  { id: 4, name: 'Arrays 4', location: '1 S', connected: [5] }, 
  { id: 5, name: 'Hashes 1', location: '2 S', connected: [6] },
  { id: 6, name: 'Hashes 2', location: '2 SW', connected: [7] },
  { id: 7, name: 'Hashes 3', location: '2 W', connected: [8] },
  { id: 8, name: 'Hashes 4', location: '2 NW', connected: [9] },
  { id: 9, name: 'Enumerables 1', location: '2 N', connected: [10] },
  { id: 10, name: 'Enumerables 2', location: '2 NE', connected: [11, 14] },
  { id: 14, name: 'Enumerables 2i', location: '2 E' },
  { id: 11, name: 'Enumerables 3', location: '3 NE', connected: [12] },
  { id: 12, name: 'Enumerables 4', location: '3 E', connected: [13] },
  { id: 13, name: 'Graphs 1', location: '4 E' }
]

const NODES = TOPIC_DATA.map(nodeData => new Node(nodeData.id, nodeData.name, nodeData.location, nodeData.connected))

graph = new Graph(NODES)

graph.layout()
