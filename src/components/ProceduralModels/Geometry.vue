<template>
    <div class="relative bg-black" id="canvas" style="width: 100%; height: 100vh;">
        <a href="https://github.com/SDEscobedo/WebWorks3D" class="absolute top-3 right-3 transition opacity-70 hover:opacity-50">
		    <svg class="w-8 fill-blue-400" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
	    </a>
        <div class="absolute bottom-3 left-3">
            <span class="text-white">Grid</span> <input checked type="checkbox" @click="toggleGrid()">
        </div>
        <router-link to="/" class="absolute top-2 left-2 transition opacity-70 hover:opacity-50">
		    <svg class="w-9 fill-blue-400" viewBox="0 0 24 24"><title>Home</title><path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z"></path></svg>
	    </router-link>
        
    </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import Footer from "../Footer.vue";
let group, camera, scene, renderer;

export default {
    name: "Geometry",
    components: {
        Footer,
    },
    data() {
        return {};
    },
    methods: {
        init: function () {
            scene = new THREE.Scene();
			const canvas = document.getElementById("canvas");

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( canvas.devicePixelRatio );
			renderer.setSize( canvas.clientWidth, canvas.clientHeight );
			canvas.appendChild(renderer.domElement)

				// camera

				camera = new THREE.PerspectiveCamera( 40,  canvas.clientWidth / canvas.clientHeight, 1, 1000 );
				camera.position.set( 15, 20, 30 );
				scene.add( camera );

				const gridHelper = new THREE.GridHelper(100, 5);
				scene.add(gridHelper);

				// controls

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.minDistance = 20;
				controls.maxDistance = 100;
				controls.maxPolarAngle = Math.PI / 2;

				// ambient light

				scene.add( new THREE.AmbientLight( 0x222222 ) );

				// point light

				const light = new THREE.PointLight( 0xffffff, 1 );
				camera.add( light );

				// helper

				scene.add( new THREE.AxesHelper( 20 ) );

				// textures

				const loader = new THREE.TextureLoader();
				const texture = loader.load( '/textures/disc.png' );

				group = new THREE.Group();
				scene.add( group );

				// points

				let dodecahedronGeometry = new THREE.DodecahedronGeometry( 10, 1 );

				// if normal and uv attributes are not removed, mergeVertices() can't consolidate indentical vertices with different normal/uv data

				dodecahedronGeometry.deleteAttribute( 'normal' );
				dodecahedronGeometry.deleteAttribute( 'uv' );

				dodecahedronGeometry = BufferGeometryUtils.mergeVertices( dodecahedronGeometry );

				const vertices = [];
				const positionAttribute = dodecahedronGeometry.getAttribute( 'position' );

				for ( let i = 0; i < positionAttribute.count; i ++ ) {

					const vertex = new THREE.Vector3();
					vertex.fromBufferAttribute( positionAttribute, i );
					vertices.push( vertex );

				}

				const pointsMaterial = new THREE.PointsMaterial( {

					color: 0xB6D7A8,
					map: texture,
					size: 1,
					alphaTest: 0.5

				} );

				const pointsGeometry = new THREE.BufferGeometry().setFromPoints( vertices );

				const points = new THREE.Points( pointsGeometry, pointsMaterial );
				group.add( points );

				// convex hull

				const meshMaterial = new THREE.MeshLambertMaterial( {
					color: 0xffffff,
					opacity: 0.5,
					transparent: true
				} );

				const meshGeometry = new ConvexGeometry( vertices );

				const mesh1 = new THREE.Mesh( meshGeometry, meshMaterial );
				mesh1.material.side = THREE.BackSide; // back faces
				mesh1.renderOrder = 0;
				group.add( mesh1 );

				const mesh2 = new THREE.Mesh( meshGeometry, meshMaterial.clone() );
				mesh2.material.side = THREE.FrontSide; // front faces
				mesh2.renderOrder = 1;
				group.add( mesh2 );

				//

				window.addEventListener( 'resize', this.onWindowResize );
        },
        onWindowResize: function () {

				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( canvas.clientWidth, canvas.clientHeight );
        },
        animate: function () {
                requestAnimationFrame( this.animate );

				group.rotation.y += 0.0005;

				this.render();
        },
        render: function(){
            renderer.render( scene, camera );
        },
        toggleGrid: function () {
            scene.children[1].visible = !scene.children[1].visible;
        }
    },
    mounted() {
        this.init();
        this.animate();
    },
    components: { Footer }
}
</script>