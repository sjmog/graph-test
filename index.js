const Coordinate = function(x, y) {
  this.x = x
  this.y = y
}

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')

context.canvas.width = window.innerWidth
context.canvas.height = window.innerHeight

context.translate(canvas.width/2,canvas.height/2);
context.scale(1, -1)

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

  // since we're using Cartesian coordinates,
  // we have to do some jiggery pokery to get
  // text the right way round.
  context.save()
  context.translate(origin.x, origin.y - (Rnode * 2))
  context.scale(1, -1)
  context.fillText(text, 0, 0)
  context.restore()
}

function Line(origin, end) {
  context.strokeStyle = '#aaa'
  context.beginPath()
  context.moveTo(origin.x, origin.y)
  context.lineTo(end.x, end.y)
  context.stroke()
}

function Link(node, connectedNode) {
  function Arc(startAngle, finishAngle, clockwise) {
    context.arc(0, 0, R * node.circle, startAngle, finishAngle, clockwise)
  }

  function isCenter() {
    return (node.location.x == 0) && (node.location.y == 0)
  }

  function isDifferentCircle() {
    return node.circle !== connectedNode.circle
  }

  context.strokeStyle = '#aaa'
  context.beginPath()

  if(isDifferentCircle() || isCenter()) {
    new Line(node.location, connectedNode.location)
  } else {
    const NORTH = Math.PI / 2
    const SOUTH = - Math.PI / 2
    const nodeAngle =  Math.atan(node.location.x / node.location.y)
    const interNodeChordLength = Math.sqrt(Math.pow(connectedNode.location.x - node.location.x, 2) + Math.pow(connectedNode.location.y - node.location.y, 2))
    const interNodeAngle = Math.acos(1 - Math.pow(interNodeChordLength, 2) / (2 * Math.pow(R * node.circle, 2)))

    // the clockwise direction is reversed as we've inverted the y axis.
    const referencePoint = node.location.y >= 0 ? NORTH : SOUTH
    const clockwise = connectedNode.location.x >= node.location.x

    if(referencePoint == NORTH) {
      if(clockwise) {
        new Arc(referencePoint - nodeAngle, referencePoint - nodeAngle - interNodeAngle, clockwise)
      } else {
        new Arc(referencePoint + nodeAngle, referencePoint + nodeAngle + interNodeAngle, clockwise)
      }
    } else {
      if(clockwise) {
        new Arc(referencePoint + nodeAngle, referencePoint + nodeAngle + interNodeAngle, !clockwise)
      } else {
        new Arc(referencePoint - nodeAngle, referencePoint - nodeAngle - interNodeAngle, !clockwise)
      }
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
    'N':  new Coordinate(0, (R * circle)),
    'NE': new Coordinate(R * circle * Math.cos(Math.PI / 4), ((R * circle) * Math.sin(Math.PI / 4))),
    'E':  new Coordinate(R * circle, 0),
    'SE': new Coordinate((R * circle * Math.cos(Math.PI / 4)), -(R * circle * Math.sin(Math.PI / 4))),
    'S':  new Coordinate(0, -(R * circle)),
    'SW': new Coordinate(-((R * circle) * Math.cos(Math.PI / 4)), (R * circle) * Math.sin(Math.PI / 4)),
    'W':  new Coordinate(-(R * circle), 0),
    'NW': new Coordinate(-((R * circle) * Math.cos(Math.PI / 4)), -((R * circle) * Math.sin(Math.PI / 4)))
  }

  if(circle == '0') {
    return new Coordinate(0, 0)
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
        new Link(node, connectedNode)
      })
    })

    this.nodes.forEach((node) => {
      new Circle(node.location, Rnode)
      new Label(node.location, node.name)
    })
  }
}

const TOPIC_DATA = [ 
  { id: 5, name: 'Center', location: '0', connected: [1] },
  { id: 1, name: '1', location: '1 N', connected: [4] },
  // { id: 2, name: '2', location: '1 NE' },
  // { id: 3, name: '3', location: '1 SE' },
  { id: 4, name: '4', location: '1 S', connected: [6] },
  // { id: 6, name: 'Outer', location: '2 S', connected: [7] },
  { id: 7, name: 'Outer 2', location: '2 E', connected: [8] },
  { id: 8, name: 'Outer 3', location: '2 W' }
]

const NODES = TOPIC_DATA.map(nodeData => new Node(nodeData.id, nodeData.name, nodeData.location, nodeData.connected))

graph = new Graph(NODES)

graph.layout()
