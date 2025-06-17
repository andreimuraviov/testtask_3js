import * as THREE from 'three';

export function addGround(scene) {
	const loader = new THREE.TextureLoader();
	const groundTexture = loader.load(
		'/textures/ground/1.jpg',
		() => {
			const groundGeometry = new THREE.PlaneGeometry( 100, 100 );
			const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture, color: '#ffffff' });
			groundMaterial.roughness = 1;

			const ground = new THREE.Mesh( groundGeometry, groundMaterial );

			ground.rotation.x = 0 - Math.PI * 0.5;
			ground.position.y = -0.01;

			ground.receiveShadow = true;
			ground.name = 'ground';

			scene.add(ground);
		}
	);
}