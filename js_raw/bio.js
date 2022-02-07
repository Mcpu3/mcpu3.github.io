import * as THREE from '../build/three.module.js'
import {CSS3DObject, CSS3DRenderer} from '../examples/jsm/renderers/CSS3DRenderer.js'


const fov = 60;

function perspectivate_camera_position_z() {
    return window.innerHeight / 2 / Math.tan(fov / 2 * Math.PI / 180);
}

const scene = new THREE.Scene();

const perspectivate_camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 2200);
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
    const css_3d_object = new CSS3DObject(document.querySelector('.l-wrapper_01'));
    css_3d_object.rotation.y = 0.25;
    objects.css_3d_object = css_3d_object;
    scene.add(css_3d_object);
}

{
    document.getElementById('ok').addEventListener('touchend', (event) => {
        location = './';
    });
}

{
    window.addEventListener('mousemove', (event) => {
        perspectivate_camera.position.set(0.5 * (window.innerWidth / 4) * (event.clientX / window.innerWidth * 2 - 1), 0.5 * (window.innerHeight / 4) * (-event.clientY / window.innerHeight * 2 + 1), perspectivate_camera_position_z());
        perspectivate_camera.lookAt(0.5 * (window.innerWidth / 4) * (event.clientX / window.innerWidth * 2 - 1), 0.5 * (window.innerHeight / 4) * (-event.clientY / window.innerHeight * 2 + 1), 0);
    });
    window.addEventListener('touchend', (event) => {
        perspectivate_camera.position.set(0.5 * (window.innerWidth / 4) * (event.changedTouches[0].clientX / window.innerWidth * 2 - 1), 0.5 * (window.innerHeight / 4) * (-event.changedTouches[0].clientY / window.innerHeight * 2 + 1), perspectivate_camera_position_z());
        perspectivate_camera.lookAt(0.5 * (window.innerWidth / 4) * (event.changedTouches[0].clientX / window.innerWidth * 2 - 1), 0.5 * (window.innerHeight / 4) * (-event.changedTouches[0].clientY / window.innerHeight * 2 + 1), 0);
    });
    window.addEventListener('touchmove', (event) => {
        perspectivate_camera.position.set(0.5 * (window.innerWidth / 4) * (event.touches[0].clientX / window.innerWidth * 2 - 1), 0.5 * (window.innerHeight / 4) * (-event.touches[0].clientY / window.innerHeight * 2 + 1), perspectivate_camera_position_z());
        perspectivate_camera.lookAt(0.5 * (window.innerWidth / 4) * (event.touches[0].clientX / window.innerWidth * 2 - 1), 0.5 * (window.innerHeight / 4) * (-event.touches[0].clientY / window.innerHeight * 2 + 1), 0);
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