import * as THREE from '../build/three.module.js'
import {BrightnessContrastShader} from '../examples/jsm/shaders/BrightnessContrastShader.js'
import {EffectComposer} from '../examples/jsm/postprocessing/EffectComposer.js'
import {FilmPass} from '../examples/jsm/postprocessing/FilmPass.js'
import {GlitchPass} from '../examples/jsm/postprocessing/GlitchPass.js'
import {GLTFLoader} from '../examples/jsm/loaders/GLTFLoader.js'
import {Lensflare, LensflareElement} from '../examples/jsm/objects/Lensflare.js'
import {OrbitControls} from '../examples/jsm/controls/OrbitControls.js'
import {OutlinePass} from '../examples/jsm/postprocessing/OutlinePass.js'
import {RenderPass} from '../examples/jsm/postprocessing/RenderPass.js'
import {RGBShiftShader} from '../examples/jsm/shaders/RGBShiftShader.js';
import {ShaderPass} from '../examples/jsm/postprocessing/ShaderPass.js'


const texture_loader = new THREE.TextureLoader();
const gltf_loader = new GLTFLoader();

const camera_r = 137.6;
const glb_r = 131.4;

const canvas = document.querySelector('#canvas')

const scene = new THREE.Scene();

const perspective_camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 2200);
{
    const theta = -1;
    perspective_camera.position.set(camera_r * Math.cos(theta), 0, camera_r * Math.sin(theta));
}

{
    function update() {
        if (perspective_camera.position.y != 0) {
            perspective_camera.position.y = 0;
        }
        const theta = Math.sign(perspective_camera.position.z) * Math.acos(perspective_camera.position.x / Math.sqrt(Math.pow(perspective_camera.position.x, 2) + Math.pow(perspective_camera.position.z, 2)));
        if (Math.sqrt(Math.pow(perspective_camera.position.x, 2) + Math.pow(perspective_camera.position.z, 2)) != camera_r) {
            perspective_camera.position.x = camera_r * Math.cos(theta);
            perspective_camera.position.z = camera_r * Math.sin(theta);
        }
        perspective_camera.lookAt(new THREE.Vector3(camera_r * Math.cos(theta + 1.5), 0, camera_r * Math.sin(theta + 1.5)));
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

const web_gl_renderer = new THREE.WebGLRenderer({canvas, antialias: true});
{
    web_gl_renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    document.body.appendChild(web_gl_renderer.domElement);
}

const objects = {};

const effect_composer = new EffectComposer(web_gl_renderer);
{
    effect_composer.setSize(web_gl_renderer.domElement.clientWidth, web_gl_renderer.domElement.clientHeight);
    const render_pass = new RenderPass(scene, perspective_camera);
    objects.render_pass = render_pass;
    effect_composer.addPass(render_pass);
}

const orbit_controls = new OrbitControls(perspective_camera, canvas);
{
    orbit_controls.enablePan = false;
    orbit_controls.enableZoom = false;
    orbit_controls.enableDamping = true;
    orbit_controls.autoRotate = true;
}

{
    const texture = texture_loader.load(
        '../resources/images/background.jpg',
        () => {
            const web_gl_cube_render_target = new THREE.WebGLCubeRenderTarget(texture.image.height);
            web_gl_cube_render_target.fromEquirectangularTexture(web_gl_renderer, texture);
            objects.background = web_gl_cube_render_target.texture;
            scene.background = web_gl_cube_render_target.texture;
        }
    );
}

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
    objects.sun = sun;
    scene.add(sun);
}

{
    function update() {
        if (Math.random() < 0.9) {
            objects.sun.children[0].visible = true;
        }
        else {
            objects.sun.children[0].visible = false;
        }
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

{
    const moon = new THREE.PointLight(0xFFFFFF, 2);
    const r = 2000;
    const theta = -90 * Math.PI / 180;
    moon.position.set(r * Math.cos(theta), 0, r * Math.sin(theta));
    objects.moon = moon;
    scene.add(moon);
}

{
    const sphere_geometry = new THREE.SphereGeometry(100);
    const mesh_lambert_material = new THREE.MeshLambertMaterial({map: texture_loader.load('../resources/images/earth.jpg')});
    const earth = new THREE.Mesh(sphere_geometry, mesh_lambert_material);
    earth.rotation.x = -23.4 * Math.PI / 180;
    objects.earth = earth;
    scene.add(earth);
    const outline_pass = new OutlinePass(new THREE.Vector2(web_gl_renderer.domElement.clientWidth, web_gl_renderer.domElement.clientHeight), scene, perspective_camera);
    outline_pass.selectedObjects = [earth];
    outline_pass.edgeGlow = 5;
    outline_pass.edgeStrength = 2.5;
    outline_pass.edgeThickness = 10;
    outline_pass.hiddenEdgeColor = new THREE.Color(0, 0, 0);
    objects.earth_outline_pass = outline_pass;
    effect_composer.addPass(outline_pass);
}

{
    gltf_loader.load('../resources/glb/sentinel6.glb', (glb) => {
        const theta = 0 * Math.PI / 180;
        glb.scene.position.set(glb_r * Math.cos(theta), 0, glb_r * Math.sin(theta));
        objects.bio_glb = glb.scene;
        scene.add(glb.scene);
        const outline_pass = new OutlinePass(new THREE.Vector2(web_gl_renderer.domElement.clientWidth, web_gl_renderer.domElement.clientHeight), scene, perspective_camera);
        web_gl_renderer.domElement.addEventListener('pointermove', (event) => {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(new THREE.Vector2(event.clientX / web_gl_renderer.domElement.clientWidth * 2 - 1, -event.clientY / web_gl_renderer.domElement.clientHeight * 2 + 1), perspective_camera);
            const selected_objects = [];
            const intersect_objects = raycaster.intersectObject(scene, true);
            if (intersect_objects.length > 0) {
                if (intersect_objects[0].object.parent.parent == glb.scene) {
                    selected_objects.push(intersect_objects[0].object);
                }
            }
            outline_pass.selectedObjects = selected_objects;
        });
        objects.bio_outline_pass = outline_pass;
        effect_composer.addPass(outline_pass);
    });
}

{
    const sprite_material = new THREE.SpriteMaterial({map: texture_loader.load('../resources/images/bio.jpg')});
    const sprite = new THREE.Sprite(sprite_material);
    const theta = 0 * Math.PI / 180;
    sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
    sprite.scale.set(6.6, 6.6, 6.6);
    objects.bio_sprite = sprite;
    scene.add(sprite);
}

{
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(event.clientX / web_gl_renderer.domElement.clientWidth * 2 - 1, -event.clientY / web_gl_renderer.domElement.clientHeight * 2 + 1), perspective_camera);
        const intersect_objects = raycaster.intersectObject(scene, true);
        if (intersect_objects.length > 0) {
            if (intersect_objects[0].object.parent.parent == objects.bio_glb || intersect_objects[0].object == objects.bio_sprite) {
                window.open('bio.html');
            }
        }
    });
}

{
    let clock = new THREE.Clock();

    function update() {
        if (clock >= 4) {
            clock = new THREE.Clock();
        }
        if ('bio_glb' in objects) {
            objects.bio_glb.rotation.set(clock.getElapsedTime() / 4 * 2 * Math.PI, clock.getElapsedTime() / 4 * 2 * Math.PI, clock.getElapsedTime() / 4 * 2 * Math.PI);
        }
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

{
    gltf_loader.load('../resources/glb/icesat2.glb', (glb) => {
        const theta = 90 * Math.PI / 180;
        glb.scene.position.set(glb_r * Math.cos(theta), 0, glb_r * Math.sin(theta));
        objects.twitter_glb = glb.scene;
        scene.add(glb.scene);
        const outline_pass = new OutlinePass(new THREE.Vector2(web_gl_renderer.domElement.clientWidth, web_gl_renderer.domElement.clientHeight), scene, perspective_camera);
        web_gl_renderer.domElement.addEventListener('pointermove', (event) => {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(new THREE.Vector2(event.clientX / web_gl_renderer.domElement.clientWidth * 2 - 1, -event.clientY / web_gl_renderer.domElement.clientHeight * 2 + 1), perspective_camera);
            const selected_objects = [];
            const intersect_objects = raycaster.intersectObject(scene, true);
            if (intersect_objects.length > 0) {
                if (intersect_objects[0].object.parent.parent == glb.scene) {
                    selected_objects.push(intersect_objects[0].object);
                }
            }
            outline_pass.selectedObjects = selected_objects;
        });
        objects.twitter_outline_pass = outline_pass;
        effect_composer.addPass(outline_pass);
    });
}

{
    const sprite_material = new THREE.SpriteMaterial({map: texture_loader.load('../resources/images/twitter.png')});
    const sprite = new THREE.Sprite(sprite_material);
    const theta = 90 * Math.PI / 180;
    sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
    sprite.scale.set(6.6, 6.6, 6.6);
    objects.twitter_sprite = sprite;
    scene.add(sprite);
}

{
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(event.clientX / web_gl_renderer.domElement.clientWidth * 2 - 1, -event.clientY / web_gl_renderer.domElement.clientHeight * 2 + 1), perspective_camera);
        const intersect_objects = raycaster.intersectObject(scene, true);
        if (intersect_objects.length > 0) {
            if (intersect_objects[0].object.parent.parent == objects.twitter_glb || intersect_objects[0].object == objects.twitter_sprite) {
                window.open('https://twitter.com/mcpu3_kei');
                const film_pass = new FilmPass();
                film_pass.uniforms.sIntensity.value = 0.5;
                film_pass.uniforms.sCount.value = 2000;
                film_pass.uniforms.grayscale = false;
                objects.film_pass = film_pass;
                effect_composer.addPass(film_pass);
            }
        }
    });
}

{
    let clock = new THREE.Clock();

    function update() {
        if (clock >= 4) {
            clock = new THREE.Clock();
        }
        if ('twitter_glb' in objects) {
            objects.twitter_glb.rotation.set(clock.getElapsedTime() / 4 * 2 * Math.PI, clock.getElapsedTime() / 4 * 2 * Math.PI, clock.getElapsedTime() / 4 * 2 * Math.PI);
        }
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

{
    gltf_loader.load('../resources/glb/cloudsat.glb', (glb) => {
        const theta = 180 * Math.PI / 180;
        glb.scene.position.set(glb_r * Math.cos(theta), 0, glb_r * Math.sin(theta));
        objects.github_glb = glb.scene;
        scene.add(glb.scene);
        const outline_pass = new OutlinePass(new THREE.Vector2(web_gl_renderer.domElement.clientWidth, web_gl_renderer.domElement.clientHeight), scene, perspective_camera);
        web_gl_renderer.domElement.addEventListener('pointermove', (event) => {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(new THREE.Vector2(event.clientX / web_gl_renderer.domElement.clientWidth * 2 - 1, -event.clientY / web_gl_renderer.domElement.clientHeight * 2 + 1), perspective_camera);
            const selected_objects = [];
            const intersect_objects = raycaster.intersectObject(scene, true);
            if (intersect_objects.length > 0) {
                if (intersect_objects[0].object.parent.parent == glb.scene) {
                    selected_objects.push(intersect_objects[0].object);
                }
            }
            outline_pass.selectedObjects = selected_objects;
        });
        objects.github_outline_pass = outline_pass;
        effect_composer.addPass(outline_pass);
    });
}

{
    const sprite_material = new THREE.SpriteMaterial({map: texture_loader.load('../resources/images/github.png')});
    const sprite = new THREE.Sprite(sprite_material);
    const theta = 180 * Math.PI / 180;
    sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
    sprite.scale.set(6.6, 6.6, 6.6);
    objects.github_sprite = sprite;
    scene.add(sprite);
}

{
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, -event.clientY / window.innerHeight * 2 + 1), perspective_camera);
        const intersect_objects = raycaster.intersectObject(scene, true);
        if (intersect_objects.length > 0) {
            if (intersect_objects[0].object.parent.parent == objects.github_glb || intersect_objects[0].object == objects.github_sprite) {
                window.open('https://github.com/Mcpu3');
                const shader_pass_rgb_shift_shader = new ShaderPass(RGBShiftShader);
                shader_pass_rgb_shift_shader.enabled = false;
                objects.shader_pass_rgb_shift_shader = shader_pass_rgb_shift_shader;
                effect_composer.addPass(shader_pass_rgb_shift_shader);
            }
        }
    });
}

{
    let clock = new THREE.Clock();

    function update() {
        if (clock >= 4) {
            clock = new THREE.Clock();
        }
        if ('github_glb' in objects) {
            objects.github_glb.rotation.set(clock.getElapsedTime() / 4 * 2 * Math.PI, clock.getElapsedTime() / 4 * 2 * Math.PI, clock.getElapsedTime() / 4 * 2 * Math.PI);
        }
        if ('shader_pass_rgb_shift_shader' in objects) {
            if (Math.random() < 0.1) {
                objects.shader_pass_rgb_shift_shader.enabled = true;
            }
            else {
                objects.shader_pass_rgb_shift_shader.enabled = false;
            }
        }
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

{
    gltf_loader.load('../resources/glb/astronaut.glb', (glb) => {
        const theta = 270 * Math.PI / 180;
        glb.scene.position.set(glb_r * Math.cos(theta), 0, glb_r * Math.sin(theta));
        objects.easteregg_glb = glb.scene;
        scene.add(glb.scene);
        const outline_pass = new OutlinePass(new THREE.Vector2(web_gl_renderer.domElement.clientWidth, web_gl_renderer.domElement.clientHeight), scene, perspective_camera);
        web_gl_renderer.domElement.addEventListener('pointermove', (event) => {
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(new THREE.Vector2(event.clientX / web_gl_renderer.domElement.clientWidth * 2 - 1, -event.clientY / web_gl_renderer.domElement.clientHeight * 2 + 1), perspective_camera);
            const selected_objects = [];
            const intersect_objects = raycaster.intersectObject(scene, true);
            if (intersect_objects.length > 0) {
                if (intersect_objects[0].object.parent.parent == glb.scene) {
                    selected_objects.push(intersect_objects[0].object);
                }
            }
            outline_pass.selectedObjects = selected_objects;
        });
        objects.easteregg_outline_pass = outline_pass;
        effect_composer.addPass(outline_pass);
    });
}

{
    const sprite_material = new THREE.SpriteMaterial({map: texture_loader.load('../resources/images/easteregg.jpg')});
    const sprite = new THREE.Sprite(sprite_material);
    const theta = 270 * Math.PI / 180;
    sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
    sprite.scale.set(6.6, 6.6, 6.6);
    objects.easteregg_sprite = sprite;
    scene.add(sprite);
}

{
    let clicked = false;
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(event.clientX / web_gl_renderer.domElement.clientWidth * 2 - 1, -event.clientY / web_gl_renderer.domElement.clientHeight * 2 + 1), perspective_camera);
        const intersect_objects = raycaster.intersectObject(scene, true);
        if (intersect_objects.length > 0) {
            if (intersect_objects[0].object.parent.parent == objects.easteregg_glb || intersect_objects[0].object == objects.easteregg_sprite) {
                if (clicked) {
                    return;
                }
                clicked = true;
                const easteregg_glb_scale = objects.easteregg_glb.scale;
                const easteregg_sprite_scale = objects.easteregg_sprite.scale;
                const wireframe_geometry = new THREE.WireframeGeometry(objects.earth.geometry);
                const line_basic_material = new THREE.LineBasicMaterial();
                const earth_wireframe = new THREE.LineSegments(wireframe_geometry, line_basic_material);
                earth_wireframe.rotation.z = -23.4 * Math.PI / 180;
                earth_wireframe.visible = false;
                objects.earth_wireframe = earth_wireframe;
                scene.add(earth_wireframe);
                const glitch_pass = new GlitchPass();
                objects.glitch_pass = glitch_pass;
                effect_composer.addPass(glitch_pass);
                const shader_pass_brightness_contrast = new ShaderPass(BrightnessContrastShader);
                shader_pass_brightness_contrast.uniforms.brightness.value = -0.5;
                shader_pass_brightness_contrast.enabled = false;
                objects.shader_pass_brightness_contrast = shader_pass_brightness_contrast;
                effect_composer.addPass(shader_pass_brightness_contrast);
                const clock = new THREE.Clock();

                function update() {
                    if (clock.getElapsedTime() >= 0.0 && clock.getElapsedTime() < 0.5) {
                        objects.easteregg_glb.scale.set(easteregg_glb_scale.x * Math.cos(clock.getElapsedTime() * Math.PI), easteregg_glb_scale.y * Math.cos(clock.getElapsedTime() * Math.PI), easteregg_glb_scale.z * Math.cos(clock.getElapsedTime() * Math.PI));
                        objects.easteregg_sprite.scale.set(easteregg_sprite_scale.x * Math.cos(clock.getElapsedTime() * Math.PI), easteregg_sprite_scale.y * Math.cos(clock.getElapsedTime() * Math.PI), easteregg_sprite_scale.z * Math.cos(clock.getElapsedTime() * Math.PI));
                    }
                    else {
                        objects.easteregg_glb.visible = false;
                        objects.easteregg_sprite.visible = false;
                    }
                    if (clock.getElapsedTime() >= 0 && clock.getElapsedTime() < 0.2) {
                        objects.earth.visible = false;
                        objects.earth_wireframe.visible = true;
                    }
                    else if (clock.getElapsedTime() >= 0.2 && clock.getElapsedTime() < 0.3) {
                        objects.earth.visible = true;
                        objects.earth_wireframe.visible = false;
                    }
                    else if (clock.getElapsedTime() >= 0.3 && clock.getElapsedTime() < 0.4) {
                        objects.earth.visible = false;
                        objects.earth_wireframe.visible = true;
                    }
                    else {
                        objects.earth.visible = true;
                        objects.earth_wireframe.visible = false;
                    }
                    if (clock.getElapsedTime() >= 4) {
                        glitch_pass.goWild = true;
                        objects.shader_pass_brightness_contrast.enabled = true;
                        if (Math.random() < 0.1) {
                            objects.earth.visible = false;
                            objects.earth_wireframe.visible = true;
                        }
                        else {
                            objects.earth.visible = true;
                            objects.earth_wireframe.visible = false;
                        }
                    }
                    requestAnimationFrame(update);
                }
    
                requestAnimationFrame(update);
            }
        }
    });
}

{
    let clock = new THREE.Clock();

    function update() {
        if (clock >= 4) {
            clock = new THREE.Clock();
        }
        if ('easteregg_glb' in objects) {
            objects.easteregg_glb.rotation.set(clock.getElapsedTime() / 4 * 2 * Math.PI, clock.getElapsedTime() / 4 * 2 * Math.PI, clock.getElapsedTime() / 4 * 2 * Math.PI);
        }
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

{
    objects.natural_satellites = []
    const sphere_buffer_geometry = new THREE.SphereBufferGeometry(3, 3, 3);
    for (let i = 0; i < 2000; i++) {
        const mesh_phong_material = new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true});
        const natural_satellite = new THREE.Mesh(sphere_buffer_geometry, mesh_phong_material)
        natural_satellite.position.set(4000 * Math.random() - 2000, 4000 * Math.random() - 2000, 4000 * Math.random() - 2000);
        natural_satellite.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI)
        natural_satellite.scale.x = natural_satellite.scale.y = natural_satellite.scale.z = Math.random()
        objects.natural_satellites.push(natural_satellite);
        scene.add(natural_satellite)
    }
}

function update() {
    if (() => {
        if (web_gl_renderer.domElement.width !== web_gl_renderer.domElement.clientWidth || web_gl_renderer.domElement.height !== web_gl_renderer.domElement.clientHeight) {
            web_gl_renderer.setSize(web_gl_renderer.domElement.clientWidth, web_gl_renderer.domElement.clientHeight, false);
            return true;
        }
        return false;
    }) {
        perspective_camera.aspect = web_gl_renderer.domElement.clientWidth / web_gl_renderer.domElement.clientHeight;
        perspective_camera.updateProjectionMatrix();
    }
    effect_composer.setSize(web_gl_renderer.domElement.clientWidth, web_gl_renderer.domElement.clientHeight);
    web_gl_renderer.render(scene, perspective_camera);
    effect_composer.render();
    orbit_controls.update();
    requestAnimationFrame(update);
}

requestAnimationFrame(update);