<template>
    <div class="relative bg-black" id="canvas" style="width: 100%; height: 100vh;">
        <a href="https://github.com/SDEscobedo/WebWorks3D" class="absolute top-3 right-3 transition opacity-70 hover:opacity-50">
		    <svg class="w-8 fill-blue-400" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
	    </a>
		<div class="absolute top-3 right-20 transition opacity-100" id="gui"></div>

        <router-link to="/" class="absolute top-2 left-2 transition opacity-70 hover:opacity-50">
		    <svg class="w-9 fill-blue-400" viewBox="0 0 24 24"><title>Home</title><path d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8h5z"></path></svg>
	    </router-link>
        
    </div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

import Footer from "../Footer.vue";

let group;
let stats;
const particlesData = [];
let camera, scene, renderer;
let positions, colors;
let particles;
let pointCloud;
let particlePositions;
let linesMesh;
let gui, canvas;

const maxParticleCount = 1000;
let particleCount = 500;
const r = 800;
const rHalf = r / 2;

const effectController = {
	showDots: true,
	showLines: true,
	minDistance: 150,
	limitConnections: false,
	maxConnections: 20,
	particleCount: 500
};

export default {
    name: "Particles",
    components: {
        Footer,
    },
    data() {
        return {};
    },
    methods: {
		launch: function(){
			
			if (!scene){
				this.init()
				console.log("scene inicialized")
			}
			else{
				this.destroy();
				this.init()
			};
		},
        init: function () {
			
			scene = new THREE.Scene();

			canvas = document.getElementById("canvas");
			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setPixelRatio( canvas.devicePixelRatio );
			renderer.setSize( canvas.clientWidth, canvas.clientHeight );
			renderer.outputEncoding = THREE.sRGBEncoding;

			canvas.appendChild( renderer.domElement );

			this.initGUI(); 

			camera = new THREE.PerspectiveCamera( 45, canvas.clientWidth / canvas.clientHeight, 1, 4000 );
			camera.position.z = 1750;

			const controls = new OrbitControls( camera, renderer.domElement );
			controls.minDistance = 1000;
			controls.maxDistance = 3000;

			group = new THREE.Group();
			scene.add( group );

			const helper = new THREE.BoxHelper( new THREE.Mesh( new THREE.BoxGeometry( r, r, r ) ) );
			helper.material.color.setHex( 0x101010 );
			helper.material.blending = THREE.AdditiveBlending;
			helper.material.transparent = true;
			group.add( helper );

			const segments = maxParticleCount * maxParticleCount;

			positions = new Float32Array( segments * 3 );
			colors = new Float32Array( segments * 3 );

			const pMaterial = new THREE.PointsMaterial( {
				color: 0xFFFFFF,
				size: 3,
				blending: THREE.AdditiveBlending,
				transparent: true,
				sizeAttenuation: false
			} );

			particles = new THREE.BufferGeometry();
			particlePositions = new Float32Array( maxParticleCount * 3 );

			for ( let i = 0; i < maxParticleCount; i ++ ) {

				const x = Math.random() * r - r / 2;
				const y = Math.random() * r - r / 2;
				const z = Math.random() * r - r / 2;

				particlePositions[ i * 3 ] = x;
				particlePositions[ i * 3 + 1 ] = y;
				particlePositions[ i * 3 + 2 ] = z;

				// add it to the geometry
				particlesData.push( {
					velocity: new THREE.Vector3( - 1 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2 ),
					numConnections: 0
				} );

			}

			particles.setDrawRange( 0, particleCount );
			particles.setAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setUsage( THREE.DynamicDrawUsage ) );

			// create the particle system
			pointCloud = new THREE.Points( particles, pMaterial );
			group.add( pointCloud );

			const geometry = new THREE.BufferGeometry();

			geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setUsage( THREE.DynamicDrawUsage ) );
			geometry.setAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setUsage( THREE.DynamicDrawUsage ) );

			geometry.computeBoundingSphere();

			geometry.setDrawRange( 0, 0 );

			const material = new THREE.LineBasicMaterial( {
				vertexColors: true,
				blending: THREE.AdditiveBlending,
				transparent: true
			} );

			linesMesh = new THREE.LineSegments( geometry, material );
			group.add( linesMesh );

			//stats = new Stats();
			//container.appendChild( stats.dom );

			window.addEventListener( 'resize', this.onWindowResize );

        },
		initGUI: function () {
			gui = new GUI({ container: document.getElementById("gui")});

			gui.add( effectController, 'showDots' ).onChange( function ( value ) {

				pointCloud.visible = value;

			} );
			gui.add( effectController, 'showLines' ).onChange( function ( value ) {

				linesMesh.visible = value;

			} );
			gui.add( effectController, 'minDistance', 10, 300 );
			gui.add( effectController, 'limitConnections' );
			gui.add( effectController, 'maxConnections', 0, 30, 1 );
			gui.add( effectController, 'particleCount', 0, maxParticleCount, 1 ).onChange( function ( value ) {

				particleCount = parseInt( value );
				particles.setDrawRange( 0, particleCount );

			} );

		},
		destroy: function() {
			gui.destroy();
			console.log("gui destroyed.")
			renderer.clear();
			console.log("renderer clear.")
			scene.remove( group );
			console.log("group removed.")
			particles.dispose();
			console.log("Buffer geometry disposed.")
			linesMesh.geometry.dispose();
			linesMesh.material.dispose();
			console.log("Line segments disposed.")
		},
        onWindowResize: function () {

				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( canvas.clientWidth, canvas.clientHeight );
        },
        animate: function () {
                let vertexpos = 0;
				let colorpos = 0;
				let numConnected = 0;

				for ( let i = 0; i < particleCount; i ++ )
					particlesData[ i ].numConnections = 0;

				for ( let i = 0; i < particleCount; i ++ ) {

					// get the particle
					const particleData = particlesData[ i ];

					particlePositions[ i * 3 ] += particleData.velocity.x;
					particlePositions[ i * 3 + 1 ] += particleData.velocity.y;
					particlePositions[ i * 3 + 2 ] += particleData.velocity.z;

					if ( particlePositions[ i * 3 + 1 ] < - rHalf || particlePositions[ i * 3 + 1 ] > rHalf )
						particleData.velocity.y = - particleData.velocity.y;

					if ( particlePositions[ i * 3 ] < - rHalf || particlePositions[ i * 3 ] > rHalf )
						particleData.velocity.x = - particleData.velocity.x;

					if ( particlePositions[ i * 3 + 2 ] < - rHalf || particlePositions[ i * 3 + 2 ] > rHalf )
						particleData.velocity.z = - particleData.velocity.z;

					if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
						continue;

					// Check collision
					for ( let j = i + 1; j < particleCount; j ++ ) {

						const particleDataB = particlesData[ j ];
						if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
							continue;

						const dx = particlePositions[ i * 3 ] - particlePositions[ j * 3 ];
						const dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ];
						const dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ];
						const dist = Math.sqrt( dx * dx + dy * dy + dz * dz );

						if ( dist < effectController.minDistance ) {

							particleData.numConnections ++;
							particleDataB.numConnections ++;

							const alpha = 1.0 - dist / effectController.minDistance;

							positions[ vertexpos ++ ] = particlePositions[ i * 3 ];
							positions[ vertexpos ++ ] = particlePositions[ i * 3 + 1 ];
							positions[ vertexpos ++ ] = particlePositions[ i * 3 + 2 ];

							positions[ vertexpos ++ ] = particlePositions[ j * 3 ];
							positions[ vertexpos ++ ] = particlePositions[ j * 3 + 1 ];
							positions[ vertexpos ++ ] = particlePositions[ j * 3 + 2 ];

							colors[ colorpos ++ ] = alpha;
							colors[ colorpos ++ ] = alpha;
							colors[ colorpos ++ ] = alpha;

							colors[ colorpos ++ ] = alpha;
							colors[ colorpos ++ ] = alpha;
							colors[ colorpos ++ ] = alpha;

							numConnected ++;

						}

					}

				}

				linesMesh.geometry.setDrawRange( 0, numConnected * 2 );
				linesMesh.geometry.attributes.position.needsUpdate = true;
				linesMesh.geometry.attributes.color.needsUpdate = true;

				pointCloud.geometry.attributes.position.needsUpdate = true;

				requestAnimationFrame( this.animate );

				//stats.update();
				this.render();
        },
        render: function(){
			const time = Date.now() * 0.001;
			group.rotation.y = time * 0.1;
			renderer.render( scene, camera );

        }
    },
    mounted() {
		this.launch();
        this.animate();
    },
    components: { Footer }
}
</script>