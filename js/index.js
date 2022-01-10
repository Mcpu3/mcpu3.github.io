import * as THREE from '../build/three.module.js'
import {OrbitControls} from '../examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from '../examples/jsm/loaders/GLTFLoader.js'
import {Lensflare, LensflareElement} from '../examples/jsm/objects/Lensflare.js'
import {EffectComposer} from '../examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from '../examples/jsm/postprocessing/RenderPass.js'
import {OutlinePass} from '../examples/jsm/postprocessing/OutlinePass.js'
import {GlitchPass} from '../examples/jsm/postprocessing/GlitchPass.js'
import {ShaderPass} from '../examples/jsm/postprocessing/ShaderPass.js'
import {BrightnessContrastShader} from '../examples/jsm/shaders/BrightnessContrastShader.js'


const camera_r = 137.6;
const glb_r = 131.4;

const texture_loader = new THREE.TextureLoader();
const gltf_loader = new GLTFLoader();

const canvas = document.querySelector('#canvas')
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2200);
{
    const theta = -1;
    camera.position.set(camera_r * Math.cos(theta), 0, camera_r * Math.sin(theta));
}
const renderer = new THREE.WebGLRenderer({canvas});
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}
const composer = new EffectComposer(renderer);
{
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
}
const controls = new OrbitControls(camera, canvas);
{
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
}

{
    const texture = texture_loader.load(
        '../resources/images/background.jpg',
        () => {
            const target = new THREE.WebGLCubeRenderTarget(texture.image.height);
            target.fromEquirectangularTexture(renderer, texture);
            scene.background = target.texture;
        }
    );
}

const objects = {};

const root = new THREE.Object3D();
scene.add(root);
objects.root = root;

{
    const sun = new THREE.PointLight(0xFFEBCD, 2);
    const r = 2000;
    const theta = 90 * Math.PI / 180;
    sun.position.set(r * Math.cos(theta), 0, r * Math.sin(theta));
    const lensflare = new Lensflare();
    const texture_0 = texture_loader.load('../examples/textures/lensflare/lensflare0.png');
    const texture_2 = texture_loader.load('../examples/textures/lensflare/lensflare2.png');
    const texture_3 = texture_loader.load('../examples/textures/lensflare/lensflare3.png');
    lensflare.addElement(new LensflareElement(texture_0, 500, 0, sun.color));
    lensflare.addElement(new LensflareElement(texture_2, 1000, 0.1, sun.color));
    lensflare.addElement(new LensflareElement(texture_3, 100, 0.5));
    lensflare.addElement(new LensflareElement(texture_3, 120, 0.6));
    lensflare.addElement(new LensflareElement(texture_3, 180, 0.9));
    lensflare.addElement(new LensflareElement(texture_3, 100, 1));
    sun.add(lensflare);
    root.add(sun);
    objects.sun = sun;
}

{
    const moon = new THREE.PointLight(0xFFFFFF, 2);
    const r = 2000;
    const theta = -90 * Math.PI / 180;
    moon.position.set(r * Math.cos(theta), 0, r * Math.sin(theta));
    root.add(moon);
    objects.moon = moon;
}

{
    const geometry = new THREE.SphereGeometry(100);
    const material = new THREE.MeshLambertMaterial({map: texture_loader.load('../resources/images/earth.jpg')});
    const earth = new THREE.Mesh(geometry, material);
    earth.rotation.x = -23.4 * Math.PI / 180;
    root.add(earth);
    objects.earth = earth;

    const outline_pass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    outline_pass.selectedObjects = [earth];
    outline_pass.edgeStrength = 2.5;
    outline_pass.edgeGlow = 5;
    outline_pass.edgeThickness = 10;
    composer.addPass(outline_pass);
}

{
    gltf_loader.load('../resources/glb/icesat2.glb', (glb) => {
        const theta = 0 * Math.PI / 180;
        glb.scene.position.set(glb_r * Math.cos(theta), 0, glb_r * Math.sin(theta));
        glb.scene.scale.set(13.2, 13.2, 13.2);
        root.add(glb.scene);
        objects.bio_glb = glb.scene;

        const outline_pass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
        renderer.domElement.addEventListener('pointermove', (event) => {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, -event.clientY / window.innerHeight * 2 + 1), camera);
            const selected_objects = [];
            const intersect_objects = raycaster.intersectObject(scene, true);
            if (intersect_objects.length > 0) {
                if (intersect_objects[0].object.parent.parent.parent == glb.scene) {
                    selected_objects.push(intersect_objects[0].object);
                }
            }
            outline_pass.selectedObjects = selected_objects;
        });
        composer.addPass(outline_pass);
    });
}

{
    const material = new THREE.SpriteMaterial({map: texture_loader.load('../resources/images/bio.png')});
    const sprite = new THREE.Sprite(material);
    const theta = 0 * Math.PI / 180;
    sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
    sprite.scale.set(6.6, 6.6, 6.6);
    root.add(sprite);
    objects.bio_sprite = sprite;
}

{
    gltf_loader.load('../resources/glb/iss.glb', (glb) => {
        const theta = 90 * Math.PI / 180;
        glb.scene.position.set(glb_r * Math.cos(theta), 0, glb_r * Math.sin(theta));
        glb.scene.scale.set(13.2, 13.2, 13.2);
        root.add(glb.scene);
        objects.twitter_glb = glb.scene;
    });
}

{
    const material = new THREE.SpriteMaterial({map: texture_loader.load('../resources/images/twitter.png')});
    const sprite = new THREE.Sprite(material);
    const theta = 90 * Math.PI / 180;
    sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
    sprite.scale.set(6.6, 6.6, 6.6);
    root.add(sprite);
    objects.twitter_sprite = sprite;
}

{
    renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, -event.clientY / window.innerHeight * 2 + 1), camera);
        const intersect_objects = raycaster.intersectObject(scene, true);
        if (intersect_objects.length > 0) {
            // if (intersect_objects[0].object.parent.parent.parent == objects.easteregg_glb || intersect_objects[0].object == objects.easteregg_sprite) {
            if (intersect_objects[0].object == objects.twitter_sprite) {
                window.open('https://twitter.com/mcpu3_kei');
            }
        }
    });
}

{
    const material = new THREE.SpriteMaterial({map: texture_loader.load('../resources/images/github.png')});
    const sprite = new THREE.Sprite(material);
    const theta = 180 * Math.PI / 180;
    sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
    sprite.scale.set(6.6, 6.6, 6.6);
    root.add(sprite);
    objects.github_sprite = sprite;
}

{
    gltf_loader.load('../resources/glb/astronaut.glb', (glb) => {
        const theta = -90 * Math.PI / 180;
        glb.scene.position.set(glb_r * Math.cos(theta), 0, glb_r * Math.sin(theta));
        root.add(glb.scene);
        objects.easteregg_glb = glb.scene;

        const outline_pass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
        renderer.domElement.addEventListener('pointermove', (event) => {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, -event.clientY / window.innerHeight * 2 + 1), camera);
            const selected_objects = [];
            const intersect_objects = raycaster.intersectObject(scene, true);
            if (intersect_objects.length > 0) {
                if (intersect_objects[0].object.parent.parent.parent == glb.scene) {
                    selected_objects.push(intersect_objects[0].object);
                }
            }
            outline_pass.selectedObjects = selected_objects;
        });
        composer.addPass(outline_pass);
    });
}

{
    renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, -event.clientY / window.innerHeight * 2 + 1), camera);
        const intersect_objects = raycaster.intersectObject(scene, true);
        if (intersect_objects.length > 0) {
            // if (intersect_objects[0].object.parent.parent.parent == objects.easteregg_glb || intersect_objects[0].object == objects.easteregg_sprite) {
            if (intersect_objects[0].object == objects.github_sprite) {
                window.open('https://github.com/Mcpu3');
            }
        }
    });
}

{
    const material = new THREE.SpriteMaterial({map: texture_loader.load('../resources/images/bio.jpg')});
    const sprite = new THREE.Sprite(material);
    const theta = -90 * Math.PI / 180;
    sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
    sprite.scale.set(6.6, 6.6, 6.6);
    root.add(sprite);
    objects.easteregg_sprite = sprite;
}

{
    renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, -event.clientY / window.innerHeight * 2 + 1), camera);
        const intersect_objects = raycaster.intersectObject(scene, true);
        if (intersect_objects.length > 0) {
            if (intersect_objects[0].object.parent.parent.parent == objects.easteregg_glb || intersect_objects[0].object == objects.easteregg_sprite) {
                objects.easteregg_glb.visible = false;
                objects.easteregg_sprite.visible = false;

                const geometry = new THREE.WireframeGeometry(objects.earth.geometry);
                const material = new THREE.LineBasicMaterial();
                const earth_wireframe = new THREE.LineSegments(geometry, material);
                earth_wireframe.rotation.z = -23.4 * Math.PI / 180;
                earth_wireframe.visible = false;
                root.add(earth_wireframe);
                objects.earth_wireframe = earth_wireframe;

                const glitch_pass = new GlitchPass();
                composer.addPass(glitch_pass);

                const shader_pass_brightness_contrast = new ShaderPass(BrightnessContrastShader);
                let added_shader_pass_brightness_contrast_to_composer = false;
                shader_pass_brightness_contrast.uniforms.brightness.value = -0.5;

                const clock_easteregg = new THREE.Clock();

                function update_easteregg() {
                    objects.earth.visible = true;
                    objects.earth_wireframe.visible = false;
                    if (clock_easteregg.getElapsedTime() >= 0.0 && clock_easteregg.getElapsedTime() < 0.2) {
                        objects.earth.visible = false;
                        objects.earth_wireframe.visible = true;
                    }
                    else if (clock_easteregg.getElapsedTime() >= 0.2 && clock_easteregg.getElapsedTime() < 0.3) {
                        objects.earth.visible = true;
                        objects.earth_wireframe.visible = false;
                    }
                    else if (clock_easteregg.getElapsedTime() >= 0.3 && clock_easteregg.getElapsedTime() < 0.4) {
                        objects.earth.visible = false;
                        objects.earth_wireframe.visible = true;
                    }
                    if (clock_easteregg.getElapsedTime() >= 4.0) {
                        if (!added_shader_pass_brightness_contrast_to_composer) {
                            composer.addPass(shader_pass_brightness_contrast);
                            added_shader_pass_brightness_contrast_to_composer = true;
                        }
                        glitch_pass.goWild = true;
                        if (Math.random() < 0.1) {
                            objects.earth.visible = false;
                            objects.earth_wireframe.visible = true;
                        }
                        else {
                            objects.earth.visible = true;
                            objects.earth_wireframe.visible = false;
                        }
                    }
                    requestAnimationFrame(update_easteregg);
                }
    
                requestAnimationFrame(update_easteregg);
            }
        }
    });
}

const clock = new THREE.Clock();

function render() {
    // if ('bio_glb' in objects) {
    //     console.log(objects.bio_glb.rotation._x);
    //     objects.glb_bio.rotation._x = clock.getElapsedTime() * 2 * Math.PI / 15;
    // }

    if (camera.position.y != 0) {
        camera.position.y = 0;
    }
    {
        const r = 137.6;
        const theta = Math.sign(camera.position.z) * Math.acos(camera.position.x / Math.sqrt(Math.pow(camera.position.x, 2) + Math.pow(camera.position.z, 2)));
        if (Math.sqrt(Math.pow(camera.position.x, 2) + Math.pow(camera.position.z, 2)) != r) {
            camera.position.x = r * Math.cos(theta);
            camera.position.z = r * Math.sin(theta);
        }
        camera.lookAt(new THREE.Vector3(r * Math.cos(theta + 1.5), 0, r * Math.sin(theta + 1.5)));
    }

    if (Math.random() < 0.9) {
        objects.sun.children[0].visible = true;
    }
    else {
        objects.sun.children[0].visible = false;
    }

    renderer.render(scene, camera);
    composer.render();
    controls.update();
    requestAnimationFrame(render);
}

requestAnimationFrame(render);