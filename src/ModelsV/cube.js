import {
    Scene,
    PerspectiveCamera,
    Mesh,
    WebGLRenderer,
    BoxGeometry,
    MeshBasicMaterial
  } from 'three'


export default class Stage {
    static instance = null
  
  static initialize (container) {
    if (!Stage.instance) {
      Stage.instance = new Stage(container)
    }
  }
  
  static destroy () {
    Stage.instance && Stage.instance.destroy()
  }
  
  // three:
  renderer
  scene
  camera
  geometry
  material
  cube
  RenderCallBack

  constructor (container) {

    this.container = container
    this.renderer = new WebGLRenderer();
    this.container.appendChild(this.renderer.domElement)
    
    this.camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.scene = new Scene();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.geometry = new BoxGeometry( 1, 1, 1 );
    this.material = new MeshBasicMaterial( { color: 0x00ff00 } );
    this.cube = new Mesh( this.geometry, this.material );
    this.scene.add( this.cube );
    this.camera.position.z = 5;
    
    this.addListeners()
    this.handleWindowResize()
    this.animate();

}  

animate = () => {
    this.RenderCallBack = requestAnimationFrame( this.animate );

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    this.renderer.render( this.scene, this.camera );
};

handleWindowResize = () => {
  this.stageWidth = window.innerWidth
  this.stageHeight = window.innerHeight
  this.renderer.setSize(this.stageWidth, this.stageHeight)
  this.camera.aspect = this.stageWidth / this.stageHeight
  this.camera.updateProjectionMatrix()
}

addListeners () {
  window.addEventListener('resize', this.handleWindowResize, false)
}

removeListeners () {
  window.removeEventListener('resize', this.handleWindowResize)
}

}







