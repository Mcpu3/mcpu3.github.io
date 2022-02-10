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
import {RGBShiftShader} from '../examples/jsm/shaders/RGBShiftShader.js'
import {ShaderPass} from '../examples/jsm/postprocessing/ShaderPass.js'


const camera_r = 137.6;
const sun_and_moon_r = 1000;
const glb_r = 131.4;

const index = document.querySelector('#index')

const scene = new THREE.Scene();

const perspective_camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, camera_r + sun_and_moon_r);
{
    const theta = -1;
    perspective_camera.position.set(camera_r * Math.cos(theta), 0, camera_r * Math.sin(theta));
    perspective_camera.lookAt(camera_r * Math.cos(theta + 1.5), 0, camera_r * Math.sin(theta + 1.5));

    function update() {
        perspective_camera.position.y = 0;
        const theta = Math.sign(perspective_camera.position.z) * Math.acos(perspective_camera.position.x / Math.sqrt(Math.pow(perspective_camera.position.x, 2) + Math.pow(perspective_camera.position.z, 2)));
        perspective_camera.position.x = camera_r * Math.cos(theta);
        perspective_camera.position.z = camera_r * Math.sin(theta);
        perspective_camera.lookAt(camera_r * Math.cos(theta + 1.5), 0, camera_r * Math.sin(theta + 1.5));
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

const web_gl_renderer = new THREE.WebGLRenderer({canvas: index, antialias: true});
{
    web_gl_renderer.setSize(index.clientWidth * window.devicePixelRatio, index.clientHeight * window.devicePixelRatio, false);
    document.body.appendChild(web_gl_renderer.domElement);
}

const objects = {};

const effect_composer = new EffectComposer(web_gl_renderer);
{
    effect_composer.setSize(web_gl_renderer.domElement.clientWidth * window.devicePixelRatio, web_gl_renderer.domElement.clientHeight * window.devicePixelRatio);
    const render_pass = new RenderPass(scene, perspective_camera);
    objects.render_pass = render_pass;
    effect_composer.addPass(render_pass);
}

const orbit_controls = new OrbitControls(perspective_camera, index);
{
    orbit_controls.enablePan = false;
    orbit_controls.enableZoom = false;
    orbit_controls.enableDamping = true;
    orbit_controls.autoRotate = true;
}

{
    const texture_loader = new THREE.TextureLoader();
    const texture = texture_loader.load('../resources/images/background.jpg', () => {
        const web_gl_cube_render_target = new THREE.WebGLCubeRenderTarget(texture.image.height);
        web_gl_cube_render_target.fromEquirectangularTexture(web_gl_renderer, texture);
        objects.background = web_gl_cube_render_target.texture;
        scene.background = web_gl_cube_render_target.texture;
    });
}

{
    const sun_light = new THREE.PointLight(0xFFEBCD, 2);
    const theta = 90 * Math.PI / 180;
    sun_light.position.set(sun_and_moon_r * Math.cos(theta), 0, sun_and_moon_r * Math.sin(theta));
    objects.sun_light = sun_light;
    scene.add(sun_light);
}

{
    const texture_loader = new THREE.TextureLoader();
    const texture_0 = texture_loader.load('../examples/textures/lensflare/lensflare0.png', () => {
        const texture_2 = texture_loader.load('../examples/textures/lensflare/lensflare2.png', () => {
            const texture_3 = texture_loader.load('../examples/textures/lensflare/lensflare3.png', () => {
                const lensflare = new Lensflare();
                lensflare.addElement(new LensflareElement(texture_0, 500, 0, objects.sun_light.color));
                lensflare.addElement(new LensflareElement(texture_2, 1000, 0.1, objects.sun_light.color));
                lensflare.addElement(new LensflareElement(texture_3, 100, 0.5));
                lensflare.addElement(new LensflareElement(texture_3, 120, 0.6));
                lensflare.addElement(new LensflareElement(texture_3, 180, 0.9));
                lensflare.addElement(new LensflareElement(texture_3, 100, 1));
                objects.lensflare = lensflare;
                objects.sun_light.add(lensflare);

                function update() {
                    if (Math.random() < 0.9) {
                        objects.lensflare.visible = true;
                    }
                    else {
                        objects.lensflare.visible = false;
                    }
                    requestAnimationFrame(update);
                }
            
                requestAnimationFrame(update);
            });
        });
    });
}

{
    const texture_loader = new THREE.TextureLoader();
    const theta = -90 * Math.PI / 180;
    const texture = texture_loader.load('../examples/textures/planets/moon_1024.jpg', () => {
        const sphere_geometry = new THREE.SphereGeometry(27.3);
        const mesh_lambert_material = new THREE.MeshLambertMaterial({map: texture});
        const moon = new THREE.Mesh(sphere_geometry, mesh_lambert_material);
        moon.position.set(sun_and_moon_r * Math.cos(theta), 0, sun_and_moon_r * Math.sin(theta));
        objects.moon = moon;
        scene.add(moon);
        const clock = new THREE.Clock();

        function update() {
            if (clock.getElapsedTime() >= 4) {
                clock.start();
            }
            const elapsed_time = clock.getElapsedTime();
            objects.moon.rotation.y = elapsed_time / 4 * 2 * Math.PI;
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    });
    const moon_light = new THREE.PointLight(0xFFFFFF, 2);
    moon_light.position.set(sun_and_moon_r * Math.cos(theta), 0, sun_and_moon_r * Math.sin(theta));
    objects.moon_light = moon_light;
    scene.add(moon_light);
}

{
    const texture_loader = new THREE.TextureLoader();
    const texture = texture_loader.load('../resources/images/earth.jpg', () => {
        const sphere_geometry = new THREE.SphereGeometry(100, 32, 32);
        const mesh_lambert_material = new THREE.MeshLambertMaterial({map: texture});
        const earth = new THREE.Mesh(sphere_geometry, mesh_lambert_material);
        earth.rotation.x = -23.4 * Math.PI / 180;
        objects.earth = earth;
        scene.add(earth);
        {
            const texture = texture_loader.load('../examples/textures/planets/earth_clouds_1024.png', () => {
                const sphere_geometry = new THREE.SphereGeometry(101.3, 32, 32);
                const mesh_lambert_material = new THREE.MeshLambertMaterial({map: texture, transparent: true, side: THREE.DoubleSide});
                const cloud = new THREE.Mesh(sphere_geometry, mesh_lambert_material);
                objects.cloud = cloud;
                objects.earth.add(cloud);
                const clock = new THREE.Clock();

                function update() {
                    if (clock.getElapsedTime() >= 60) {
                        clock.start();
                    }
                    const elapsed_time = clock.getElapsedTime();
                    objects.cloud.rotation.y = elapsed_time / 60 * 2 * Math.PI;
                    requestAnimationFrame(update);
                }

                requestAnimationFrame(update);
            });
        }
    });
}

{
    const gltf_loader = new GLTFLoader();
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
        const clock = new THREE.Clock();

        function update() {
            if (clock.getElapsedTime() >= 4) {
                clock.start();
            }
            const elapsed_time = clock.getElapsedTime();
            objects.bio_glb.rotation.set(elapsed_time / 4 * 2 * Math.PI, elapsed_time / 4 * 2 * Math.PI, elapsed_time / 4 * 2 * Math.PI);
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    });
}

{
    const texture_loader = new THREE.TextureLoader();
    const texture = texture_loader.load('../resources/images/bio.jpg', () => {
        const sprite_material = new THREE.SpriteMaterial({map: texture});
        const sprite = new THREE.Sprite(sprite_material);
        const theta = 0 * Math.PI / 180;
        sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
        sprite.scale.set(6.6, 6.6, 6.6);
        objects.bio_sprite = sprite;
        scene.add(sprite);
    });
}

{
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(event.clientX / web_gl_renderer.domElement.clientWidth * 2 - 1, -event.clientY / web_gl_renderer.domElement.clientHeight * 2 + 1), perspective_camera);
        const intersect_objects = raycaster.intersectObject(scene, true);
        if (!(intersect_objects.length > 0)) {
            return;
        }
        if ('bio_glb' in objects && intersect_objects[0].object.parent.parent == objects.bio_glb || 'bio_sprite' in objects && intersect_objects[0].object == objects.bio_sprite) {
            location = './bio.html';
        }
    });
}

{
    const gltf_loader = new GLTFLoader();
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
        const clock = new THREE.Clock();

        function update() {
            if (clock.getElapsedTime() >= 4) {
                clock.start();
            }
            const elapsed_time = clock.getElapsedTime();
            objects.twitter_glb.rotation.set(elapsed_time / 4 * 2 * Math.PI, elapsed_time / 4 * 2 * Math.PI, elapsed_time / 4 * 2 * Math.PI);
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    });
}

{
    const texture_loader = new THREE.TextureLoader();
    const texture = texture_loader.load('../resources/images/twitter.png', () => {
        const sprite_material = new THREE.SpriteMaterial({map: texture});
        const sprite = new THREE.Sprite(sprite_material);
        const theta = 90 * Math.PI / 180;
        sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
        sprite.scale.set(6.6, 6.6, 6.6);
        objects.twitter_sprite = sprite;
        scene.add(sprite);
    });
}

{
    const film_pass = new FilmPass();
    film_pass.uniforms.sIntensity.value = 0.5;
    film_pass.uniforms.sCount.value = 1000;
    film_pass.uniforms.grayscale = false;
    film_pass.enabled = false;
    objects.film_pass = film_pass;
    effect_composer.addPass(film_pass);
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(event.clientX / web_gl_renderer.domElement.clientWidth * 2 - 1, -event.clientY / web_gl_renderer.domElement.clientHeight * 2 + 1), perspective_camera);
        const intersect_objects = raycaster.intersectObject(scene, true);
        if (!(intersect_objects.length > 0)) {
            return;
        }
        if ('twitter_glb' in objects && intersect_objects[0].object.parent.parent == objects.twitter_glb || 'twitter_sprite' in objects && intersect_objects[0].object == objects.twitter_sprite) {
            window.open('https://twitter.com/mcpu3_kei/');
            objects.film_pass.enabled = true;
        }
    });
}

{
    const gltf_loader = new GLTFLoader();
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
        const clock = new THREE.Clock();

        function update() {
            if (clock.getElapsedTime() >= 4) {
                clock.start();
            }
            const elapsed_time = clock.getElapsedTime();
            objects.github_glb.rotation.set(elapsed_time / 4 * 2 * Math.PI, elapsed_time / 4 * 2 * Math.PI, elapsed_time / 4 * 2 * Math.PI);
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    });
}

{
    const texture_loader = new THREE.TextureLoader();
    const texture = texture_loader.load('../resources/images/github.png', () => {
        const sprite_material = new THREE.SpriteMaterial({map: texture});
        const sprite = new THREE.Sprite(sprite_material);
        const theta = 180 * Math.PI / 180;
        sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
        sprite.scale.set(6.6, 6.6, 6.6);
        objects.github_sprite = sprite;
        scene.add(sprite);
    });
}

{
    let clicked = false;
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(event.clientX / window.innerWidth * 2 - 1, -event.clientY / window.innerHeight * 2 + 1), perspective_camera);
        const intersect_objects = raycaster.intersectObject(scene, true);
        if (!(intersect_objects.length > 0)) {
            return;
        }
        if ('github_glb' in objects && intersect_objects[0].object.parent.parent == objects.github_glb || 'github_sprite' in objects && intersect_objects[0].object == objects.github_sprite) {
            window.open('https://github.com/Mcpu3/');
            if (clicked) {
                return;
            }
            clicked = true;
            const shader_pass_rgb_shift_shader = new ShaderPass(RGBShiftShader);
            shader_pass_rgb_shift_shader.enabled = false;
            objects.shader_pass_rgb_shift_shader = shader_pass_rgb_shift_shader;
            effect_composer.addPass(shader_pass_rgb_shift_shader);

            function update() {
                if (Math.random() < 0.1) {
                    objects.shader_pass_rgb_shift_shader.enabled = true;
                }
                else {
                    objects.shader_pass_rgb_shift_shader.enabled = false;
                }
                requestAnimationFrame(update);
            }

            requestAnimationFrame(update);
        }
    });
}

{
    const gltf_loader = new GLTFLoader();
    gltf_loader.load('../resources/glb/mkiii.glb', (glb) => {
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
        const clock = new THREE.Clock();

        function update() {
            if (clock.getElapsedTime() >= 4) {
                clock.start();
            }
            const elapsed_time = clock.getElapsedTime();
            objects.easteregg_glb.rotation.set(elapsed_time / 4 * 2 * Math.PI, elapsed_time / 4 * 2 * Math.PI, elapsed_time / 4 * 2 * Math.PI);
            requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    });
}

{
    const texture_loader = new THREE.TextureLoader();
    const texture = texture_loader.load('../resources/images/easteregg.jpg', () => {
        const sprite_material = new THREE.SpriteMaterial({map: texture});
        const sprite = new THREE.Sprite(sprite_material);
        const theta = 270 * Math.PI / 180;
        sprite.position.set(glb_r * Math.cos(theta), 6.6, glb_r * Math.sin(theta));
        sprite.scale.set(6.6, 6.6, 6.6);
        objects.easteregg_sprite = sprite;
        scene.add(sprite);
    });
}

{
    let clicked = false;
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(event.clientX / web_gl_renderer.domElement.clientWidth * 2 - 1, -event.clientY / web_gl_renderer.domElement.clientHeight * 2 + 1), perspective_camera);
        const intersect_objects = raycaster.intersectObject(scene, true);
        if (!(intersect_objects.length > 0)) {
            return;
        }
        if (!('easteregg_glb' in objects && intersect_objects[0].object.parent.parent == objects.easteregg_glb || 'easteregg_sprite' in objects && intersect_objects[0].object == objects.easteregg_sprite)) {
            return;
        }
        if (!('earth' in objects)) {
            return;
        }
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
            const elapsed_time = clock.getElapsedTime();
            if (elapsed_time >= 0.0 && elapsed_time < 0.5) {
                objects.easteregg_glb.scale.set(easteregg_glb_scale.x * Math.cos(elapsed_time * Math.PI), easteregg_glb_scale.y * Math.cos(elapsed_time * Math.PI), easteregg_glb_scale.z * Math.cos(elapsed_time * Math.PI));
                objects.easteregg_sprite.scale.set(easteregg_sprite_scale.x * Math.cos(elapsed_time * Math.PI), easteregg_sprite_scale.y * Math.cos(elapsed_time * Math.PI), easteregg_sprite_scale.z * Math.cos(elapsed_time * Math.PI));
            }
            else {
                objects.easteregg_glb.visible = false;
                objects.easteregg_sprite.visible = false;
            }
            if (elapsed_time >= 0 && elapsed_time < 0.2) {
                objects.earth.visible = false;
                objects.earth_wireframe.visible = true;
            }
            else if (elapsed_time >= 0.2 && elapsed_time < 0.3) {
                objects.earth.visible = true;
                objects.earth_wireframe.visible = false;
            }
            else if (elapsed_time >= 0.3 && elapsed_time < 0.4) {
                objects.earth.visible = false;
                objects.earth_wireframe.visible = true;
            }
            else {
                objects.earth.visible = true;
                objects.earth_wireframe.visible = false;
            }
            if (elapsed_time >= 4) {
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
    });
}

{
    objects.natural_satellites = []
    const sphere_buffer_geometry = new THREE.SphereBufferGeometry(3, 3, 3);
    for (let i = 0; i < 1000; i++) {
        const mesh_phong_material = new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true});
        const natural_satellite = new THREE.Mesh(sphere_buffer_geometry, mesh_phong_material);
        const r = Math.random() * (sun_and_moon_r - camera_r) * 0.5 + camera_r + (sun_and_moon_r - camera_r) * 0.5;
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * 2 * Math.PI;
        natural_satellite.position.set(r * Math.sin(theta) * Math.cos(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(theta));
        natural_satellite.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
        natural_satellite.scale.x = natural_satellite.scale.y = natural_satellite.scale.z = Math.random();
        objects.natural_satellites.push(natural_satellite);
        scene.add(natural_satellite)
    }
}

function update() {
    if (() => {
        if (web_gl_renderer.domElement.width !== web_gl_renderer.domElement.clientWidth || web_gl_renderer.domElement.height !== web_gl_renderer.domElement.clientHeight) {
            web_gl_renderer.setSize(web_gl_renderer.domElement.clientWidth * window.devicePixelRatio, web_gl_renderer.domElement.clientHeight * window.devicePixelRatio, false);
            return true;
        }
        return false;
    }) {
        perspective_camera.aspect = web_gl_renderer.domElement.clientWidth / web_gl_renderer.domElement.clientHeight;
        perspective_camera.updateProjectionMatrix();
    }
    effect_composer.setSize(web_gl_renderer.domElement.clientWidth * window.devicePixelRatio, web_gl_renderer.domElement.clientHeight * window.devicePixelRatio);
    web_gl_renderer.render(scene, perspective_camera);
    effect_composer.render();
    orbit_controls.update();
    requestAnimationFrame(update);
}

requestAnimationFrame(update);