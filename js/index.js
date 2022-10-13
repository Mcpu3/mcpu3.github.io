import * as THREE from 'three'
import {BrightnessContrastShader} from './../js/node_modules/three/examples/jsm/shaders/BrightnessContrastShader.js'
import {DRACOLoader} from './../js/node_modules/three/examples/jsm/loaders/DRACOLoader.js'
import {EffectComposer} from './../js/node_modules/three/examples/jsm/postprocessing/EffectComposer.js'
import {FilmPass} from './../js/node_modules/three/examples/jsm/postprocessing/FilmPass.js'
import {GlitchPass} from './../js/node_modules/three/examples/jsm/postprocessing/GlitchPass.js'
import {GLTFLoader} from './../js/node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import {Lensflare, LensflareElement} from './../js/node_modules/three/examples/jsm/objects/Lensflare.js'
import {OrbitControls} from './../js/node_modules/three/examples/jsm/controls/OrbitControls.js'
import {OutlinePass} from './../js/node_modules/three/examples/jsm/postprocessing/OutlinePass.js'
import {RenderPass} from './../js/node_modules/three/examples/jsm/postprocessing/RenderPass.js'
import {RGBShiftShader} from './../js/node_modules/three/examples/jsm/shaders/RGBShiftShader.js'
import {ShaderPass} from './../js/node_modules/three/examples/jsm/postprocessing/ShaderPass.js'


const sun_and_moon_position_r = 1000
const earth_scale_r = 100
const cloud_scale_r = (6356.8 + 80) / 6356.8 * earth_scale_r
const moon_scale_r = 1737.2 / 6356.8 * earth_scale_r
const glb_and_sprite_position_r = (6356.8 + 2000) / 6356.8 * earth_scale_r
const sprite_scale_r = 0.25 * (glb_and_sprite_position_r - earth_scale_r)
const camera_position_r = glb_and_sprite_position_r + sprite_scale_r

const index = document.querySelector('#index')

const scene = new THREE.Scene()

const perspective_camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, camera_position_r + sun_and_moon_position_r + moon_scale_r)
{
    const d_theta = Math.acos(0.5 * (earth_scale_r + glb_and_sprite_position_r) / camera_position_r)
    const theta = -90 * Math.PI / 180
    perspective_camera.position.set(camera_position_r * Math.cos(theta), 0, camera_position_r * Math.sin(theta))
    perspective_camera.lookAt(0.5 * (earth_scale_r + glb_and_sprite_position_r) * Math.cos(theta + d_theta), 0, 0.5 * (earth_scale_r + glb_and_sprite_position_r) * Math.sin(theta + d_theta))

    function update() {
        perspective_camera.position.y = 0
        const theta = Math.sign(perspective_camera.position.z) * Math.acos(perspective_camera.position.x / Math.hypot(perspective_camera.position.x, perspective_camera.position.z))
        perspective_camera.position.x = camera_position_r * Math.cos(theta)
        perspective_camera.position.z = camera_position_r * Math.sin(theta)
        perspective_camera.lookAt(0.5 * (earth_scale_r + glb_and_sprite_position_r) * Math.cos(theta + d_theta), 0, 0.5 * (earth_scale_r + glb_and_sprite_position_r) * Math.sin(theta + d_theta))
        requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
}

const web_gl_renderer = new THREE.WebGLRenderer({canvas: index, antialias: true})
{
    web_gl_renderer.setSize(window.devicePixelRatio * index.clientWidth, window.devicePixelRatio * index.clientHeight, false)
    document.body.appendChild(web_gl_renderer.domElement)
}

const objects = {}

const effect_composer = new EffectComposer(web_gl_renderer)
{
    effect_composer.setSize(window.devicePixelRatio * web_gl_renderer.domElement.clientWidth, window.devicePixelRatio * web_gl_renderer.domElement.clientHeight)
    const render_pass = new RenderPass(scene, perspective_camera)
    objects.render_pass = render_pass
    effect_composer.addPass(objects.render_pass)
}

const orbit_controls = new OrbitControls(perspective_camera, index)
{
    orbit_controls.enablePan = false
    orbit_controls.enableZoom = false
    orbit_controls.enableDamping = true
    orbit_controls.autoRotate = true
}

{
    const texture = new THREE.TextureLoader().load('./../resources/images/background.webp', () => {
        const web_gl_cube_render_target = new THREE.WebGLCubeRenderTarget(texture.image.height)
        web_gl_cube_render_target.fromEquirectangularTexture(web_gl_renderer, texture)
        objects.background = web_gl_cube_render_target.texture
        scene.background = objects.background
    })
}

{
    const sun_light = new THREE.SpotLight(0xFFEBCD, 2)
    const theta = 90 * Math.PI / 180
    sun_light.position.set(sun_and_moon_position_r * Math.cos(theta), 0, sun_and_moon_position_r * Math.sin(theta))
    objects.sun_light = sun_light
    scene.add(objects.sun_light)
}

{
    const texture_0 = new THREE.TextureLoader().load('./../resources/images/lensflare/lensflare_0.webp', () => {
        const texture_1 = new THREE.TextureLoader().load('./../resources/images/lensflare/lensflare_1.webp', () => {
            const texture_2 = new THREE.TextureLoader().load('./../resources/images/lensflare/lensflare_2.webp', () => {
                const lensflare = new Lensflare()
                lensflare.addElement(new LensflareElement(texture_0, 500, 0, objects.sun_light.color))
                lensflare.addElement(new LensflareElement(texture_1, 1000, 0.1, objects.sun_light.color))
                lensflare.addElement(new LensflareElement(texture_2, 100, 0.5))
                lensflare.addElement(new LensflareElement(texture_2, 120, 0.6))
                lensflare.addElement(new LensflareElement(texture_2, 180, 0.9))
                lensflare.addElement(new LensflareElement(texture_2, 100, 1))
                objects.lensflare = lensflare
                objects.sun_light.add(objects.lensflare)

                function update() {
                    if (Math.random() < 0.9) {
                        objects.lensflare.visible = true
                    }
                    else {
                        objects.lensflare.visible = false
                    }
                    requestAnimationFrame(update)
                }
            
                requestAnimationFrame(update)
            })
        })
    })
}

{
    const sphere_geometry = new THREE.SphereGeometry(earth_scale_r, 32, 32)
    const mesh_phong_material = new THREE.MeshPhongMaterial()
    const earth = new THREE.Mesh(sphere_geometry, mesh_phong_material)
    const texture = new THREE.TextureLoader().load('./../resources/images/planets/earth.webp', () => {
        earth.material.map = texture
        earth.material.needsUpdate = true
    })
    const texture_normal = new THREE.TextureLoader().load('./../resources/images/planets/earth_normal.webp', () => {
        earth.material.normalMap = texture_normal
        earth.material.needsUpdate = true
    })
    const texture_specular = new THREE.TextureLoader().load('./../resources/images/planets/earth_specular.webp', () => {
        earth.material.specularMap = texture_specular
        earth.material.needsUpdate = true
    })
    earth.rotation.x = -23.4 * Math.PI / 180
    objects.earth = earth
    scene.add(objects.earth)
    {
        const sphere_geometry = new THREE.SphereGeometry(cloud_scale_r, 32, 32)
        const mesh_lambert_material = new THREE.MeshLambertMaterial({transparent: true, side: THREE.DoubleSide})
        const cloud = new THREE.Mesh(sphere_geometry, mesh_lambert_material)
        const texture = new THREE.TextureLoader().load('./../resources/images/planets/clouds.webp', () => {
            cloud.material.map = texture
            cloud.material.needsUpdate = true
        })
        objects.cloud = cloud
        objects.earth.add(objects.cloud)
        const clock = new THREE.Clock()

        function update() {
            const elapsed_time = clock.getElapsedTime() % 60
            objects.cloud.rotation.y = 2 * Math.PI * elapsed_time / 60
            requestAnimationFrame(update)
        }

        requestAnimationFrame(update)
    }
}

{
    const theta = -90 * Math.PI / 180
    const sphere_geometry = new THREE.SphereGeometry(moon_scale_r)
    const mesh_lambert_material = new THREE.MeshLambertMaterial()
    const moon = new THREE.Mesh(sphere_geometry, mesh_lambert_material)
    const texture = new THREE.TextureLoader().load('./../resources/images/planets/moon.webp', () => {
        moon.material.map = texture
        moon.material.needsUpdate = true
    })
    moon.position.set(sun_and_moon_position_r * Math.cos(theta), 0, sun_and_moon_position_r * Math.sin(theta))
    objects.moon = moon
    scene.add(objects.moon)
    const clock = new THREE.Clock()

    function update() {
        const elapsed_time = clock.getElapsedTime() % 4
        objects.moon.rotation.y = 2 * Math.PI * elapsed_time / 4
        requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
    const moon_light = new THREE.PointLight(0xFFFFFF, 2)
    moon_light.position.set(sun_and_moon_position_r * Math.cos(theta), 0, sun_and_moon_position_r * Math.sin(theta))
    objects.moon_light = moon_light
    scene.add(objects.moon_light)
}


{
    objects.natural_satellites = []
    const sphere_buffer_geometry = new THREE.SphereGeometry(3, 3, 3)
    for (let i = 0; i < 1000; i++) {
        const mesh_phong_material = new THREE.MeshPhongMaterial({color: 0x666666, flatShading: true})
        const natural_satellite = new THREE.Mesh(sphere_buffer_geometry, mesh_phong_material)
        const r = 0.5 * (sun_and_moon_position_r - camera_position_r) * Math.random() + 0.5 * (sun_and_moon_position_r - camera_position_r) + camera_position_r
        const theta = 2 * Math.PI * Math.random()
        const phi = 2 * Math.PI * Math.random()
        natural_satellite.position.set(r * Math.sin(theta) * Math.cos(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(theta))
        natural_satellite.rotation.set(2 * Math.PI * Math.random(), 2 * Math.PI * Math.random(), 2 * Math.PI * Math.random())
        natural_satellite.scale.x = natural_satellite.scale.y = natural_satellite.scale.z = Math.random()
        objects.natural_satellites.push(natural_satellite)
        scene.add(natural_satellite)
    }
}

{
    new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath('./node_modules/three/examples/js/libs/draco/')).load('./../resources/glb/bio.glb', (glb) => {
        const theta = 0 * Math.PI / 180
        glb.scene.position.set(glb_and_sprite_position_r * Math.cos(theta), 0, glb_and_sprite_position_r * Math.sin(theta))
        objects.bio_glb = glb.scene
        scene.add(objects.bio_glb)
        const outline_pass = new OutlinePass(new THREE.Vector2(window.devicePixelRatio * web_gl_renderer.domElement.clientWidth, window.devicePixelRatio * web_gl_renderer.domElement.clientHeight), scene, perspective_camera)
        const raycaster = new THREE.Raycaster()
        web_gl_renderer.domElement.addEventListener('pointermove', (event) => {
            const selected_objects = []
            raycaster.setFromCamera(new THREE.Vector2(2 * event.clientX / web_gl_renderer.domElement.clientWidth - 1, -2 * event.clientY / web_gl_renderer.domElement.clientHeight + 1), perspective_camera)
            const intersect_objects = raycaster.intersectObject(scene, true)
            if (intersect_objects.length > 0) {
                if (intersect_objects[0].object.parent.parent === objects.bio_glb) {
                    selected_objects.push(objects.bio_glb)
                }
            }
            outline_pass.selectedObjects = selected_objects
        })
        objects.bio_outline_pass = outline_pass
        effect_composer.addPass(objects.bio_outline_pass)
        const clock = new THREE.Clock()

        function update() {
            const elapsed_time = clock.getElapsedTime() % 4
            objects.bio_glb.rotation.set(2 * Math.PI * elapsed_time / 4, 2 * Math.PI * elapsed_time / 4, 2 * Math.PI * elapsed_time / 4)
            requestAnimationFrame(update)
        }

        requestAnimationFrame(update)
    })
}

{
    const sprite_material = new THREE.SpriteMaterial()
    const sprite = new THREE.Sprite(sprite_material)
    const texture = new THREE.TextureLoader().load('./../resources/images/bio.webp', () => {
        sprite.material.map = texture
        sprite.material.needsUpdate = true
    })
    const theta = 0 * Math.PI / 180
    sprite.position.set(glb_and_sprite_position_r * Math.cos(theta), sprite_scale_r, glb_and_sprite_position_r * Math.sin(theta))
    sprite.scale.set(sprite_scale_r, sprite_scale_r, sprite_scale_r)
    objects.bio_sprite = sprite
    scene.add(objects.bio_sprite)
}

{
    const raycaster = new THREE.Raycaster()
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        raycaster.setFromCamera(new THREE.Vector2(2 * event.clientX / web_gl_renderer.domElement.clientWidth - 1, -2 * event.clientY / web_gl_renderer.domElement.clientHeight + 1), perspective_camera)
        const intersect_objects = raycaster.intersectObject(scene, true)
        if (!(intersect_objects.length > 0)) {
            return
        }
        if ('bio_glb' in objects && intersect_objects[0].object.parent.parent === objects.bio_glb || intersect_objects[0].object === objects.bio_sprite) {
            location = './bio.html'
        }
    })
}

{
    new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath('./node_modules/three/examples/js/libs/draco/')).load('./../resources/glb/twitter.glb', (glb) => {
        const theta = 90 * Math.PI / 180
        glb.scene.position.set(glb_and_sprite_position_r * Math.cos(theta), 0, glb_and_sprite_position_r * Math.sin(theta))
        objects.twitter_glb = glb.scene
        scene.add(objects.twitter_glb)
        const outline_pass = new OutlinePass(new THREE.Vector2(window.devicePixelRatio * web_gl_renderer.domElement.clientWidth, window.devicePixelRatio * web_gl_renderer.domElement.clientHeight), scene, perspective_camera)
        const raycaster = new THREE.Raycaster()
        web_gl_renderer.domElement.addEventListener('pointermove', (event) => {
            const selected_objects = []
            raycaster.setFromCamera(new THREE.Vector2(2 * event.clientX / web_gl_renderer.domElement.clientWidth - 1, -2 * event.clientY / web_gl_renderer.domElement.clientHeight + 1), perspective_camera)
            const intersect_objects = raycaster.intersectObject(scene, true)
            if (intersect_objects.length > 0) {
                if (intersect_objects[0].object.parent.parent === objects.twitter_glb) {
                    selected_objects.push(objects.twitter_glb)
                }
            }
            outline_pass.selectedObjects = selected_objects
        })
        objects.twitter_outline_pass = outline_pass
        effect_composer.addPass(objects.twitter_outline_pass)
        const clock = new THREE.Clock()

        function update() {
            const elapsed_time = clock.getElapsedTime() % 4
            objects.twitter_glb.rotation.set(2 * Math.PI * elapsed_time / 4, 2 * Math.PI * elapsed_time / 4, 2 * Math.PI * elapsed_time / 4)
            requestAnimationFrame(update)
        }

        requestAnimationFrame(update)
    })
}

{
    const sprite_material = new THREE.SpriteMaterial()
    const sprite = new THREE.Sprite(sprite_material)
    const texture = new THREE.TextureLoader().load('./../resources/images/twitter.webp', () => {
        sprite.material.map = texture
        sprite.material.needsUpdate = true
    })
    const theta = 90 * Math.PI / 180
    sprite.position.set(glb_and_sprite_position_r * Math.cos(theta), sprite_scale_r, glb_and_sprite_position_r * Math.sin(theta))
    sprite.scale.set(sprite_scale_r, sprite_scale_r, sprite_scale_r)
    objects.twitter_sprite = sprite
    scene.add(objects.twitter_sprite)
}

{
    const film_pass = new FilmPass()
    film_pass.uniforms.sIntensity.value = 0.5
    film_pass.uniforms.sCount.value = 1000
    film_pass.uniforms.grayscale = false
    film_pass.enabled = false
    objects.film_pass = film_pass
    effect_composer.addPass(objects.film_pass)
    const raycaster = new THREE.Raycaster()
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        raycaster.setFromCamera(new THREE.Vector2(2 * event.clientX / web_gl_renderer.domElement.clientWidth - 1, -2 * event.clientY / web_gl_renderer.domElement.clientHeight + 1), perspective_camera)
        const intersect_objects = raycaster.intersectObject(scene, true)
        if (!(intersect_objects.length > 0)) {
            return
        }
        if ('twitter_glb' in objects && intersect_objects[0].object.parent.parent === objects.twitter_glb || intersect_objects[0].object === objects.twitter_sprite) {
            window.open('https://twitter.com/mcpu3_kei/')
            objects.film_pass.enabled = true
        }
    })
}

{
    new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath('./node_modules/three/examples/js/libs/draco/')).load('./../resources/glb/github.glb', (glb) => {
        const theta = 180 * Math.PI / 180
        glb.scene.position.set(glb_and_sprite_position_r * Math.cos(theta), 0, glb_and_sprite_position_r * Math.sin(theta))
        objects.github_glb = glb.scene
        scene.add(objects.github_glb)
        const outline_pass = new OutlinePass(new THREE.Vector2(window.devicePixelRatio * web_gl_renderer.domElement.clientWidth, window.devicePixelRatio * web_gl_renderer.domElement.clientHeight), scene, perspective_camera)
        const raycaster = new THREE.Raycaster()
        web_gl_renderer.domElement.addEventListener('pointermove', (event) => {
            const selected_objects = []
            raycaster.setFromCamera(new THREE.Vector2(2 * event.clientX / web_gl_renderer.domElement.clientWidth - 1, -2 * event.clientY / web_gl_renderer.domElement.clientHeight + 1), perspective_camera)
            const intersect_objects = raycaster.intersectObject(scene, true)
            if (intersect_objects.length > 0) {
                if (intersect_objects[0].object.parent.parent === objects.github_glb) {
                    selected_objects.push(objects.github_glb)
                }
            }
            outline_pass.selectedObjects = selected_objects
        })
        objects.github_outline_pass = outline_pass
        effect_composer.addPass(objects.github_outline_pass)
        const clock = new THREE.Clock()

        function update() {
            const elapsed_time = clock.getElapsedTime() % 4
            objects.github_glb.rotation.set(2 * Math.PI * elapsed_time / 4, 2 * Math.PI * elapsed_time / 4, 2 * Math.PI * elapsed_time / 4)
            requestAnimationFrame(update)
        }

        requestAnimationFrame(update)
    })
}

{
    const sprite_material = new THREE.SpriteMaterial()
    const sprite = new THREE.Sprite(sprite_material)
    const texture = new THREE.TextureLoader().load('./../resources/images/github.webp', () => {
        sprite.material.map = texture
        sprite.material.needsUpdate = true
    })
    const theta = 180 * Math.PI / 180
    sprite.position.set(glb_and_sprite_position_r * Math.cos(theta), sprite_scale_r, glb_and_sprite_position_r * Math.sin(theta))
    sprite.scale.set(sprite_scale_r, sprite_scale_r, sprite_scale_r)
    objects.github_sprite = sprite
    scene.add(objects.github_sprite)
}

{
    const shader_pass_rgb_shift_shader = new ShaderPass(RGBShiftShader)
    shader_pass_rgb_shift_shader.enabled = false
    objects.shader_pass_rgb_shift_shader = shader_pass_rgb_shift_shader
    effect_composer.addPass(objects.shader_pass_rgb_shift_shader)
    const raycaster = new THREE.Raycaster()
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        raycaster.setFromCamera(new THREE.Vector2(2 * event.clientX / window.innerWidth - 1, -2 * event.clientY / window.innerHeight + 1), perspective_camera)
        const intersect_objects = raycaster.intersectObject(scene, true)
        if (!(intersect_objects.length > 0)) {
            return
        }
        if ('github_glb' in objects && intersect_objects[0].object.parent.parent === objects.github_glb || intersect_objects[0].object === objects.github_sprite) {
            window.open('https://github.com/Mcpu3/')

            function update() {
                if (Math.random() < 0.1) {
                    objects.shader_pass_rgb_shift_shader.enabled = true
                }
                else {
                    objects.shader_pass_rgb_shift_shader.enabled = false
                }
                requestAnimationFrame(update)
            }

            requestAnimationFrame(update)
        }
    })
}

{
    new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath('./node_modules/three/examples/js/libs/draco/')).load('./../resources/glb/easteregg.glb', (glb) => {
        const theta = 270 * Math.PI / 180
        glb.scene.position.set(glb_and_sprite_position_r * Math.cos(theta), 0, glb_and_sprite_position_r * Math.sin(theta))
        objects.easteregg_glb = glb.scene
        scene.add(objects.easteregg_glb)
        const outline_pass = new OutlinePass(new THREE.Vector2(window.devicePixelRatio * web_gl_renderer.domElement.clientWidth, window.devicePixelRatio * web_gl_renderer.domElement.clientHeight), scene, perspective_camera)
        const raycaster = new THREE.Raycaster()
        web_gl_renderer.domElement.addEventListener('pointermove', (event) => {
            const selected_objects = []
            raycaster.setFromCamera(new THREE.Vector2(2 * event.clientX / web_gl_renderer.domElement.clientWidth - 1, -2 * event.clientY / web_gl_renderer.domElement.clientHeight + 1), perspective_camera)
            const intersect_objects = raycaster.intersectObject(scene, true)
            if (intersect_objects.length > 0) {
                if (intersect_objects[0].object.parent.parent === objects.easteregg_glb) {
                    selected_objects.push(objects.easteregg_glb)
                }
            }
            outline_pass.selectedObjects = selected_objects
        })
        objects.easteregg_outline_pass = outline_pass
        effect_composer.addPass(objects.easteregg_outline_pass)
        const clock = new THREE.Clock()

        function update() {
            const elapsed_time = clock.getElapsedTime() % 4
            objects.easteregg_glb.rotation.set(2 * Math.PI * elapsed_time / 4, 2 * Math.PI * elapsed_time / 4, 2 * Math.PI * elapsed_time / 4)
            requestAnimationFrame(update)
        }

        requestAnimationFrame(update)
    })
}

{
    const sprite_material = new THREE.SpriteMaterial()
    const sprite = new THREE.Sprite(sprite_material)
    const texture = new THREE.TextureLoader().load('./../resources/images/easteregg.webp', () => {
        sprite.material.map = texture
        sprite.material.needsUpdate = true
    })
    const theta = 270 * Math.PI / 180
    sprite.position.set(glb_and_sprite_position_r * Math.cos(theta), sprite_scale_r, glb_and_sprite_position_r * Math.sin(theta))
    sprite.scale.set(sprite_scale_r, sprite_scale_r, sprite_scale_r)
    objects.easteregg_sprite = sprite
    scene.add(objects.easteregg_sprite)
}

{
    const wireframe_geometry = new THREE.WireframeGeometry(objects.earth.geometry)
    const line_basic_material = new THREE.LineBasicMaterial()
    const earth_wireframe = new THREE.LineSegments(wireframe_geometry, line_basic_material)
    earth_wireframe.rotation.z = -23.4 * Math.PI / 180
    earth_wireframe.visible = false
    objects.earth_wireframe = earth_wireframe
    scene.add(objects.earth_wireframe)
    let clicked = false
    const raycaster = new THREE.Raycaster()
    web_gl_renderer.domElement.addEventListener('click', (event) => {
        raycaster.setFromCamera(new THREE.Vector2(2 * event.clientX / web_gl_renderer.domElement.clientWidth - 1, -2 * event.clientY / web_gl_renderer.domElement.clientHeight + 1), perspective_camera)
        const intersect_objects = raycaster.intersectObject(scene, true)
        if (!(intersect_objects.length > 0)) {
            return
        }
        if (!('easteregg_glb' in objects && intersect_objects[0].object.parent.parent === objects.easteregg_glb || intersect_objects[0].object === objects.easteregg_sprite)) {
            return
        }
        if (clicked) {
            return
        }
        clicked = true
        const glitch_pass = new GlitchPass()
        objects.glitch_pass = glitch_pass
        effect_composer.addPass(objects.glitch_pass)
        const shader_pass_brightness_contrast = new ShaderPass(BrightnessContrastShader)
        shader_pass_brightness_contrast.uniforms.brightness.value = -0.5
        shader_pass_brightness_contrast.enabled = false
        objects.shader_pass_brightness_contrast = shader_pass_brightness_contrast
        effect_composer.addPass(objects.shader_pass_brightness_contrast)
        const clock = new THREE.Clock()

        function update() {
            const elapsed_time = clock.getElapsedTime()
            if (elapsed_time >= 0 && elapsed_time < 0.2) {
                objects.earth.visible = false
                objects.earth_wireframe.visible = true
            }
            else if (elapsed_time >= 0.2 && elapsed_time < 0.3) {
                objects.earth.visible = true
                objects.earth_wireframe.visible = false
            }
            else if (elapsed_time >= 0.3 && elapsed_time < 0.4) {
                objects.earth.visible = false
                objects.earth_wireframe.visible = true
            }
            else if (elapsed_time >= 0.4 && elapsed_time < 4) {
                objects.earth.visible = true
                objects.earth_wireframe.visible = false
            }
            else {
                objects.glitch_pass.goWild = true
                objects.shader_pass_brightness_contrast.enabled = true
                if (Math.random() < 0.1) {
                    objects.earth.visible = false
                    objects.earth_wireframe.visible = true
                }
                else {
                    objects.earth.visible = true
                    objects.earth_wireframe.visible = false
                }
            }
            if (elapsed_time >= 0.0 && elapsed_time < 0.5) {
                if ('easteregg_glb' in objects) {
                    objects.easteregg_glb.scale.set(Math.cos(elapsed_time * Math.PI), Math.cos(elapsed_time * Math.PI), Math.cos(elapsed_time * Math.PI))
                }
                objects.easteregg_sprite.scale.set(sprite_scale_r * Math.cos(elapsed_time * Math.PI), sprite_scale_r * Math.cos(elapsed_time * Math.PI), sprite_scale_r * Math.cos(elapsed_time * Math.PI))
            }
            else {
                if ('easteregg_glb' in objects) {
                    objects.easteregg_glb.visible = false
                }
                objects.easteregg_sprite.visible = false
            }
            requestAnimationFrame(update)
        }

        requestAnimationFrame(update)
    })
}

function update() {
    function resize() {
        if (web_gl_renderer.domElement.width !== web_gl_renderer.domElement.clientWidth || web_gl_renderer.domElement.height !== web_gl_renderer.domElement.clientHeight) {
            web_gl_renderer.setSize(window.devicePixelRatio * web_gl_renderer.domElement.clientWidth, window.devicePixelRatio * web_gl_renderer.domElement.clientHeight, false)
            return true
        }
        return false
    }

    if (resize()) {
        perspective_camera.aspect = web_gl_renderer.domElement.clientWidth / web_gl_renderer.domElement.clientHeight
        perspective_camera.updateProjectionMatrix()
    }
    effect_composer.setSize(window.devicePixelRatio * web_gl_renderer.domElement.clientWidth, window.devicePixelRatio * web_gl_renderer.domElement.clientHeight)
    web_gl_renderer.render(scene, perspective_camera)
    effect_composer.render()
    orbit_controls.update()
    requestAnimationFrame(update)
}

requestAnimationFrame(update)