import * as THREE from 'three'
import {CSS3DObject, CSS3DRenderer} from './../modules/three/examples/jsm/renderers/CSS3DRenderer.js'


const fov = 60;

function perspectivate_camera_position_z() {
    return 0.5 * window.innerHeight / Math.tan(0.5 * fov * Math.PI / 180);
}

const scene = new THREE.Scene();

const perspectivate_camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight);
{
    perspectivate_camera.position.z = perspectivate_camera_position_z();
}

const css_3d_renderer = new CSS3DRenderer({antialias: true});
{
    css_3d_renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('bio').appendChild(css_3d_renderer.domElement);
}

const objects = {};

{
    const css_3d_object = new CSS3DObject(document.getElementById('card'));
    css_3d_object.rotation.y = 15 * Math.PI / 180;
    objects.css_3d_object = css_3d_object;
    scene.add(objects.css_3d_object);
}

{
    document.getElementById('ok').addEventListener('pointerup', (event) => {
        location = './';
    });
    document.getElementById('twitter').addEventListener('pointerup', (event) => {
        window.open('https://twitter.com/mcpu3_kei/');
    });
}

{
    window.addEventListener('pointermove', (event) => {
        perspectivate_camera.position.set(0.125 * window.innerWidth * (2 * event.clientX / window.innerWidth - 1), 0.125 * window.innerHeight * (-2 * event.clientY / window.innerHeight + 1), perspectivate_camera_position_z());
        perspectivate_camera.lookAt(0.125 * window.innerWidth * (2 * event.clientX / window.innerWidth - 1), 0.125 * window.innerHeight * (-2 * event.clientY / window.innerHeight + 1), 0);
    });
    window.addEventListener('pointerup', (event) => {
        perspectivate_camera.position.set(0.125 * window.innerWidth * (2 * event.clientX / window.innerWidth - 1), 0.125 * window.innerHeight * (-2 * event.clientY / window.innerHeight + 1), perspectivate_camera_position_z());
        perspectivate_camera.lookAt(0.125 * window.innerWidth * (2 * event.clientX / window.innerWidth - 1), 0.125 * window.innerHeight * (-2 * event.clientY / window.innerHeight + 1), 0);
    });
}

function update() {
    perspectivate_camera.position.z = perspectivate_camera_position_z();
    css_3d_renderer.setSize(window.innerWidth, window.innerHeight);
    perspectivate_camera.aspect = window.innerWidth / window.innerHeight;
    perspectivate_camera.updateProjectionMatrix();
    css_3d_renderer.render(scene, perspectivate_camera);
    requestAnimationFrame(update);
}

requestAnimationFrame(update);