/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"./node_modules/three/build/three.module.js\");\n\r\n\r\n\r\n\r\n\r\nwindow.addEventListener('DOMContentLoaded', () => {\r\n    const app = new App();\r\n    app.init();\r\n    app.render();\r\n});\r\n\r\n/**\r\n * アプリケーション管理クラス\r\n */\r\nclass App {\r\n\r\n    /**\r\n     * カメラ定義のための定数\r\n     */\r\n    static get CAMERA_PARAM() {\r\n        return {\r\n            fovy: 60,\r\n            aspect: window.innerWidth / window.innerHeight,\r\n            near: 0.01,\r\n            far: 2000.0,\r\n            x: 0.0,\r\n            y: 60.0,\r\n            z: 120.0,\r\n            lookAt: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0.0, 0.0, 0.0),\r\n        };\r\n    }\r\n\r\n    static get CAMERA_PARAM_SP() {\r\n        return {\r\n            fovy: 60,\r\n            aspect: window.innerWidth / window.innerHeight,\r\n            near: 0.01,\r\n            far: 2000.0,\r\n            x: 0.0,\r\n            y: 120.0,\r\n            z: 240.0,\r\n            lookAt: new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0.0, 0.0, 0.0),\r\n        };\r\n    }\r\n\r\n    static get GROUP_POS() {\r\n        return {\r\n            x: 0.0,\r\n            y: 0.0,\r\n            z: 0.0,\r\n        };\r\n    }\r\n\r\n    static get GROUP_POS_SP() {\r\n        return {\r\n            x: 0.0,\r\n            y: -40.0,\r\n            z: 0.0,\r\n        };\r\n    }\r\n\r\n    static get SCREEN_POS() {\r\n        return {\r\n            x: 0.0,\r\n            y: 22.0,\r\n            z: 38.0,\r\n        };\r\n    }\r\n\r\n    static get SCREEN_POS_SP() {\r\n        return {\r\n            x: 0.0,\r\n            y: 64.0,\r\n            z: 38.0,\r\n        };\r\n    }\r\n\r\n\r\n    /**\r\n     * レンダラー定義のための定数\r\n     */\r\n    static get RENDERER_PARAM() {\r\n        return {\r\n            clearColor: 0xffffff,\r\n            width: window.innerWidth,\r\n            height: window.innerHeight,\r\n        };\r\n    }\r\n\r\n    /**\r\n     * フォグの定義のための定数\r\n     */\r\n    static get FOG_PARAM() {\r\n        return {\r\n            fogColor: 0xffffff, // フォグの色\r\n            fogNear: 1.0,      // フォグの掛かり始めるカメラからの距離\r\n            fogFar: 1000.0        // フォグが完全に掛かるカメラからの距離\r\n        };\r\n    }\r\n\r\n\r\n\r\n    constructor() {\r\n        this.renderer;           // レンダラ\r\n        this.scene;              // シーン\r\n        this.camera;             // カメラ\r\n        this.cameraPositionX;\r\n        this.cameraPositionY;\r\n        this.cameraPositionZ;\r\n        this.planeGeometry;      // プレーン\r\n        this.material;           // マテリアル\r\n        this.plane;              // プレーンメッシュ\r\n        this.screenGeometry;     // スクリーンジオメトリ\r\n        this.screenMaterial;     // スクリーンマテリアル\r\n        this.screen;             // スクリーン\r\n        this.screenPositionX;\r\n        this.screenPositionY;\r\n        this.screenPositionZ;\r\n        this.group;              // グループ\r\n        this.groupPositionX;\r\n        this.groupPositionY;\r\n        this.groupPositionZ;\r\n        this.raycaster;          // レイキャスター\r\n        this.pointer = new three__WEBPACK_IMPORTED_MODULE_0__.Vector2();\r\n        this.hoveredObject = null;\r\n\r\n        this.textures = [];\r\n\r\n        this.loadingManager = new three__WEBPACK_IMPORTED_MODULE_0__.LoadingManager();\r\n        this.loadingManager.onStart = this.onLoadStart.bind(this);\r\n        this.loadingManager.onLoad = this.onLoadComplete.bind(this);\r\n        this.loadingManager.onProgress = this.onLoadProgress.bind(this);\r\n        this.loadingManager.onError = this.onLoadError.bind(this);\r\n        this.textureLoader = new three__WEBPACK_IMPORTED_MODULE_0__.TextureLoader(this.loadingManager);\r\n\r\n\r\n        this.render = this.render.bind(this);\r\n        window.addEventListener('resize', this.onWindowResize.bind(this));\r\n        this.loadTime = 0;\r\n    }\r\n\r\n    onLoadStart(url, itemsLoaded, itemsTotal) {\r\n        document.getElementById('loading').style.display = 'block';\r\n        this.loadTime = Date.now();\r\n    }\r\n\r\n    onLoadComplete() {\r\n        const minLoadTime = 5000; // 3 seconds\r\n        const elapsedTime = Date.now() - this.loadTime;\r\n        const remainingTime = minLoadTime - elapsedTime;\r\n\r\n        if (remainingTime > 0) {\r\n            setTimeout(() => {\r\n                document.getElementById('loading').style.display = 'none';\r\n            }, remainingTime);\r\n        } else {\r\n            document.getElementById('loading').style.display = 'none';\r\n        }\r\n    }\r\n\r\n    onLoadProgress(url, itemsLoaded, itemsTotal) {\r\n    }\r\n\r\n    onLoadError(url) {\r\n        console.log(`There was an error loading ${url}`);\r\n    }\r\n\r\n\r\n    init() {\r\n        // レンダラー\r\n        this.renderer = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderer();\r\n        this.renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_0__.Color(App.RENDERER_PARAM.clearColor));\r\n        this.renderer.setSize(App.RENDERER_PARAM.width, App.RENDERER_PARAM.height);\r\n        const wrapper = document.querySelector('#webgl');\r\n        wrapper.appendChild(this.renderer.domElement);\r\n\r\n        // シーンとフォグ\r\n        this.scene = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();\r\n        this.scene.fog = new three__WEBPACK_IMPORTED_MODULE_0__.Fog(\r\n            App.FOG_PARAM.fogColor,\r\n            App.FOG_PARAM.fogNear,\r\n            App.FOG_PARAM.fogFar\r\n        );\r\n        // カメラ\r\n        this.camera = new three__WEBPACK_IMPORTED_MODULE_0__.PerspectiveCamera(\r\n            App.CAMERA_PARAM.fovy,\r\n            App.CAMERA_PARAM.aspect,\r\n            App.CAMERA_PARAM.near,\r\n            App.CAMERA_PARAM.far,\r\n        );\r\n        this.camera.lookAt(App.CAMERA_PARAM.lookAt);\r\n\r\n        this.group = new three__WEBPACK_IMPORTED_MODULE_0__.Group();\r\n        this.raycaster = new three__WEBPACK_IMPORTED_MODULE_0__.Raycaster();\r\n\r\n        for (let i = 0; i < 20; i++) {\r\n            this.textures.push(this.textureLoader.load(`./images/tex_${String(i + 1).padStart(2, '0')}.jpg`));\r\n        }\r\n\r\n\r\n        const LENGTH = 80;\r\n        const RADIUS = 70;\r\n\r\n        this.planeGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry(18, 12);\r\n        this.material = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({ color: 0x00ff00 , side: three__WEBPACK_IMPORTED_MODULE_0__.DoubleSide });\r\n\r\n        for (let i = 0; i < LENGTH; i++) {\r\n            const theta = (i / LENGTH) * Math.PI * 2;\r\n            const x = Math.sin(theta) * RADIUS;\r\n            const z = Math.cos(theta) * RADIUS;\r\n\r\n            this.plane = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(this.planeGeometry, this.material);\r\n            this.plane.userData.index = i;\r\n            this.plane.position.set(x, 0, z);\r\n            // テクスチャをセット\r\n            const textureIndex = i % this.textures.length;\r\n            this.plane.material = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({\r\n                map: this.textures[textureIndex],\r\n                side: three__WEBPACK_IMPORTED_MODULE_0__.DoubleSide\r\n            });\r\n\r\n            this.plane.rotation.y = theta + Math.PI / 2;\r\n\r\n\r\n            this.group.add(this.plane);\r\n\r\n        }\r\n        this.group.position.set(this.groupPositionX, this.groupPositionY, this.groupPositionZ);\r\n        this.scene.add(this.group);\r\n        \r\n\r\n        this.screenGeometry = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry(18, 12);\r\n        this.screenMaterial = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({  map: this.textures[0] , side: three__WEBPACK_IMPORTED_MODULE_0__.DoubleSide });\r\n        this.screen = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(this.screenGeometry, this.screenMaterial);\r\n        this.screen.scale.set(4, 4, 4);\r\n        this.screen.rotation.x = (50 / 360) * Math.PI * 2 * -1;\r\n        this.screen.position.set(this.screenPositionX, this.screenPositionY, this.screenPositionZ);\r\n        this.scene.add(this.screen);\r\n\r\n\r\n        // マウス座標の取得\r\n        this.onPointerMove = (event) => {\r\n            this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;\r\n            this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;\r\n        }\r\n\r\n\r\n        // dev\r\n        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);\r\n        const axesBarLength = 5.0;\r\n        this.axesHelper = new three__WEBPACK_IMPORTED_MODULE_0__.AxesHelper(axesBarLength);\r\n        this.scene.add(this.axesHelper);\r\n        this.setPositionsForDevice();\r\n    }\r\n\r\n    onWindowResize() {\r\n        this.camera.aspect = window.innerWidth / window.innerHeight;\r\n        this.camera.updateProjectionMatrix();\r\n        this.renderer.setSize(window.innerWidth, window.innerHeight);\r\n\r\n    }\r\n\r\n    setPositionsForDevice() {\r\n        const isMobile = window.innerWidth < 768;\r\n        const cameraParam = isMobile ? App.CAMERA_PARAM_SP : App.CAMERA_PARAM;\r\n        const screenPos = isMobile ? App.SCREEN_POS_SP : App.SCREEN_POS;\r\n        const groupPos = isMobile ? App.GROUP_POS_SP : App.GROUP_POS;\r\n\r\n        this.camera.position.set(cameraParam.x, cameraParam.y, cameraParam.z);\r\n        this.camera.lookAt(cameraParam.lookAt);\r\n        this.screen.position.set(screenPos.x, screenPos.y, screenPos.z);\r\n        this.group.position.set(groupPos.x, groupPos.y, groupPos.z);\r\n    }\r\n    render() {\r\n\r\n        // コントロールを更新\r\n        // this.controls.update();\r\n\r\n        // 恒常ループ\r\n        requestAnimationFrame(this.render);\r\n\r\n        // レンダラーで描画\r\n        this.renderer.render(this.scene, this.camera);\r\n\r\n        const _this = this;\r\n        window.addEventListener( 'pointermove', function(event) {\r\n\r\n            _this.onPointerMove(event);\r\n\r\n            _this.raycaster.setFromCamera( _this.pointer, _this.camera );\r\n            const intersects = _this.raycaster.intersectObjects( _this.group.children );\r\n\r\n            // ホバーしているオブジェクトがある場合\r\n            if (intersects.length > 0) {\r\n                // もし新しいオブジェクトにホバーした場合\r\n                if (_this.hoveredObject !== intersects[0].object) {\r\n                    // 前のオブジェクトの色を元に戻す\r\n                    if (_this.hoveredObject) {\r\n                        const index = _this.hoveredObject.userData.index;\r\n                        const theta = (index / 80) * Math.PI * 2;\r\n                        const x = Math.sin(theta) * 70;\r\n                        const z = Math.cos(theta) * 70;\r\n                        _this.hoveredObject.position.set(x, 0, z);\r\n                    }\r\n                    // 新しいオブジェクトの色を変更\r\n                    _this.hoveredObject = intersects[0].object;\r\n                    const index = _this.hoveredObject.userData.index;\r\n                    const theta = (index / 80) * Math.PI * 2;\r\n                    const x = Math.sin(theta) * 74;\r\n                    const z = Math.cos(theta) * 74;\r\n                    const textureIndex = index % _this.textures.length;\r\n                    _this.hoveredObject.position.set(x, 0, z);\r\n                    _this.screen.material.map = _this.textures[textureIndex];\r\n                    _this.screen.material.needsUpdate = true;\r\n                }\r\n            } else {\r\n                // ホバーしているオブジェクトがない場合\r\n                if (_this.hoveredObject) {\r\n                }\r\n            }\r\n        });\r\n        this.onWindowResize();\r\n        this.setPositionsForDevice();\r\n\r\n        this.group.rotation.y += 0.0005;\r\n    }\r\n\r\n\r\n}\n\n//# sourceURL=webpack://dev/./index.js?");

/***/ }),

/***/ "./node_modules/three/build/three.module.js":
/*!**************************************************!*\
  !*** ./node_modules/three/build/three.module.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./index.js");
/******/ 	
/******/ })()
;