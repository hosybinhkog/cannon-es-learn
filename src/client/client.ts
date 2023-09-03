import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as CANNON from 'cannon-es'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(6, 8, 20)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const gridHelper = new THREE.GridHelper(40, 40)
scene.add(gridHelper)

const axesHelper = new THREE.AxesHelper(4)
scene.add(axesHelper)

const groundGeo = new THREE.PlaneGeometry(30, 30)
const groundMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: true,
})

const groundMesh = new THREE.Mesh(groundGeo, groundMat)
scene.add(groundMesh)

const boxGeo = new THREE.BoxGeometry(2, 2, 2)
const boxMat = new THREE.MeshBasicMaterial({
    color: 'red',
    wireframe: true,
})

const boxMesh = new THREE.Mesh(boxGeo, boxMat)
scene.add(boxMesh)

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0),
})

const timeStep = 1 / 60

const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    // mass: 2,
    type: CANNON.Body.STATIC,
    position: new CANNON.Vec3(0, 2, 0),
})

world.addBody(groundBody)
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)

const boxBody = new CANNON.Body({
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    mass: 2,
    position: new CANNON.Vec3(1, 20, 0),
})
boxBody.angularVelocity.set(0, 10, 0)
world.addBody(boxBody)

const sphereGeo = new THREE.SphereGeometry(2)
const sphereMat = new THREE.MeshBasicMaterial({
    color: 'skyblue',
    wireframe: true,
})

const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
scene.add(sphereMesh)

const sphereBody = new CANNON.Body({
    shape: new CANNON.Sphere(2),
    mass: 10,
    position: new CANNON.Vec3(5, 15, 0),
})

sphereBody.linearDamping = 0.1

world.addBody(sphereBody)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)
    world.step(timeStep)
    // @ts-ignore
    groundMesh.position.copy(groundBody.position)
    // @ts-ignore
    groundMesh.quaternion.copy(groundBody.quaternion)

    // @ts-ignore
    boxMesh.position.copy(boxBody.position)
    // @ts-ignore
    boxMesh.quaternion.copy(boxBody.quaternion)

    // @ts-ignore
    sphereMesh.position.copy(sphereBody.position)
    // @ts-ignore
    sphereMesh.quaternion.copy(sphereBody.quaternion)
    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}
animate()
