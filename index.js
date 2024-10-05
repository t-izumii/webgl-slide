import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


window.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
    app.render();
});

/**
 * アプリケーション管理クラス
 */
class App {

    /**
     * カメラ定義のための定数
     */
    static get CAMERA_PARAM() {
        return {
            fovy: 60,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.01,
            far: 2000.0,
            x: 0.0,
            y: 60.0,
            z: 120.0,
            lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
        };
    }

    static get CAMERA_PARAM_SP() {
        return {
            fovy: 60,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.01,
            far: 2000.0,
            x: 0.0,
            y: 120.0,
            z: 240.0,
            lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
        };
    }

    static get GROUP_POS() {
        return {
            x: 0.0,
            y: 0.0,
            z: 0.0,
        };
    }

    static get GROUP_POS_SP() {
        return {
            x: 0.0,
            y: -40.0,
            z: 0.0,
        };
    }

    static get SCREEN_POS() {
        return {
            x: 0.0,
            y: 22.0,
            z: 38.0,
        };
    }

    static get SCREEN_POS_SP() {
        return {
            x: 0.0,
            y: 64.0,
            z: 38.0,
        };
    }


    /**
     * レンダラー定義のための定数
     */
    static get RENDERER_PARAM() {
        return {
            clearColor: 0xffffff,
            width: window.innerWidth,
            height: window.innerHeight,
        };
    }

    /**
     * フォグの定義のための定数
     */
    static get FOG_PARAM() {
        return {
            fogColor: 0xffffff, // フォグの色
            fogNear: 1.0,      // フォグの掛かり始めるカメラからの距離
            fogFar: 1000.0        // フォグが完全に掛かるカメラからの距離
        };
    }



    constructor() {
        this.renderer;           // レンダラ
        this.scene;              // シーン
        this.camera;             // カメラ
        this.cameraPositionX;
        this.cameraPositionY;
        this.cameraPositionZ;
        this.planeGeometry;      // プレーン
        this.material;           // マテリアル
        this.plane;              // プレーンメッシュ
        this.screenGeometry;     // スクリーンジオメトリ
        this.screenMaterial;     // スクリーンマテリアル
        this.screen;             // スクリーン
        this.screenPositionX;
        this.screenPositionY;
        this.screenPositionZ;
        this.group;              // グループ
        this.groupPositionX;
        this.groupPositionY;
        this.groupPositionZ;
        this.raycaster;          // レイキャスター
        this.pointer = new THREE.Vector2();
        this.hoveredObject = null;

        this.textures = [];

        this.loadingManager = new THREE.LoadingManager();
        this.loadingManager.onStart = this.onLoadStart.bind(this);
        this.loadingManager.onLoad = this.onLoadComplete.bind(this);
        this.loadingManager.onProgress = this.onLoadProgress.bind(this);
        this.loadingManager.onError = this.onLoadError.bind(this);
        this.textureLoader = new THREE.TextureLoader(this.loadingManager);


        this.render = this.render.bind(this);
        window.addEventListener('resize', this.onWindowResize.bind(this));
        this.loadTime = 0;
    }

    onLoadStart(url, itemsLoaded, itemsTotal) {
        document.getElementById('loading').style.display = 'block';
        this.loadTime = Date.now();
    }

    onLoadComplete() {
        const minLoadTime = 5000; // 3 seconds
        const elapsedTime = Date.now() - this.loadTime;
        const remainingTime = minLoadTime - elapsedTime;

        if (remainingTime > 0) {
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, remainingTime);
        } else {
            document.getElementById('loading').style.display = 'none';
        }
    }

    onLoadProgress(url, itemsLoaded, itemsTotal) {
    }

    onLoadError(url) {
        console.log(`There was an error loading ${url}`);
    }


    init() {
        // レンダラー
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(App.RENDERER_PARAM.clearColor));
        this.renderer.setSize(App.RENDERER_PARAM.width, App.RENDERER_PARAM.height);
        const wrapper = document.querySelector('#webgl');
        wrapper.appendChild(this.renderer.domElement);

        // シーンとフォグ
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(
            App.FOG_PARAM.fogColor,
            App.FOG_PARAM.fogNear,
            App.FOG_PARAM.fogFar
        );
        // カメラ
        this.camera = new THREE.PerspectiveCamera(
            App.CAMERA_PARAM.fovy,
            App.CAMERA_PARAM.aspect,
            App.CAMERA_PARAM.near,
            App.CAMERA_PARAM.far,
        );
        this.camera.lookAt(App.CAMERA_PARAM.lookAt);

        this.group = new THREE.Group();
        this.raycaster = new THREE.Raycaster();

        for (let i = 0; i < 20; i++) {
            this.textures.push(this.textureLoader.load(`./images/tex_${String(i + 1).padStart(2, '0')}.jpg`));
        }


        const LENGTH = 80;
        const RADIUS = 70;

        this.planeGeometry = new THREE.PlaneGeometry(18, 12);
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 , side: THREE.DoubleSide });

        for (let i = 0; i < LENGTH; i++) {
            const theta = (i / LENGTH) * Math.PI * 2;
            const x = Math.sin(theta) * RADIUS;
            const z = Math.cos(theta) * RADIUS;

            this.plane = new THREE.Mesh(this.planeGeometry, this.material);
            this.plane.userData.index = i;
            this.plane.position.set(x, 0, z);
            // テクスチャをセット
            const textureIndex = i % this.textures.length;
            this.plane.material = new THREE.MeshBasicMaterial({
                map: this.textures[textureIndex],
                side: THREE.DoubleSide
            });

            this.plane.rotation.y = theta + Math.PI / 2;


            this.group.add(this.plane);

        }
        this.group.position.set(this.groupPositionX, this.groupPositionY, this.groupPositionZ);
        this.scene.add(this.group);
        

        this.screenGeometry = new THREE.PlaneGeometry(18, 12);
        this.screenMaterial = new THREE.MeshBasicMaterial({  map: this.textures[0] , side: THREE.DoubleSide });
        this.screen = new THREE.Mesh(this.screenGeometry, this.screenMaterial);
        this.screen.scale.set(4, 4, 4);
        this.screen.rotation.x = (50 / 360) * Math.PI * 2 * -1;
        this.screen.position.set(this.screenPositionX, this.screenPositionY, this.screenPositionZ);
        this.scene.add(this.screen);


        // マウス座標の取得
        this.onPointerMove = (event) => {
            this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        }


        // dev
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        const axesBarLength = 5.0;
        this.axesHelper = new THREE.AxesHelper(axesBarLength);
        this.scene.add(this.axesHelper);
        this.setPositionsForDevice();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    setPositionsForDevice() {
        const isMobile = window.innerWidth < 768;
        const cameraParam = isMobile ? App.CAMERA_PARAM_SP : App.CAMERA_PARAM;
        const screenPos = isMobile ? App.SCREEN_POS_SP : App.SCREEN_POS;
        const groupPos = isMobile ? App.GROUP_POS_SP : App.GROUP_POS;

        this.camera.position.set(cameraParam.x, cameraParam.y, cameraParam.z);
        this.camera.lookAt(cameraParam.lookAt);
        this.screen.position.set(screenPos.x, screenPos.y, screenPos.z);
        this.group.position.set(groupPos.x, groupPos.y, groupPos.z);
    }
    render() {

        // コントロールを更新
        // this.controls.update();

        // 恒常ループ
        requestAnimationFrame(this.render);

        // レンダラーで描画
        this.renderer.render(this.scene, this.camera);

        const _this = this;
        window.addEventListener( 'pointermove', function(event) {

            _this.onPointerMove(event);

            _this.raycaster.setFromCamera( _this.pointer, _this.camera );
            const intersects = _this.raycaster.intersectObjects( _this.group.children );

            // ホバーしているオブジェクトがある場合
            if (intersects.length > 0) {
                // もし新しいオブジェクトにホバーした場合
                if (_this.hoveredObject !== intersects[0].object) {
                    // 前のオブジェクトの色を元に戻す
                    if (_this.hoveredObject) {
                        const index = _this.hoveredObject.userData.index;
                        const theta = (index / 80) * Math.PI * 2;
                        const x = Math.sin(theta) * 70;
                        const z = Math.cos(theta) * 70;
                        _this.hoveredObject.position.set(x, 0, z);
                    }
                    // 新しいオブジェクトの色を変更
                    _this.hoveredObject = intersects[0].object;
                    const index = _this.hoveredObject.userData.index;
                    const theta = (index / 80) * Math.PI * 2;
                    const x = Math.sin(theta) * 74;
                    const z = Math.cos(theta) * 74;
                    const textureIndex = index % _this.textures.length;
                    _this.hoveredObject.position.set(x, 0, z);
                    _this.screen.material.map = _this.textures[textureIndex];
                    _this.screen.material.needsUpdate = true;
                }
            } else {
                // ホバーしているオブジェクトがない場合
                if (_this.hoveredObject) {
                }
            }
        });
        this.onWindowResize();
        this.setPositionsForDevice();

        this.group.rotation.y += 0.0005;
    }


}