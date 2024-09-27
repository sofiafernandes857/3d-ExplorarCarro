document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF); // Fundo branco

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const isMobile = window.innerWidth <= 768; // Define se o dispositivo é móvel
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024; // Define se o dispositivo é um tablet

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight * 0.8); // Ajustar altura
    container.appendChild(renderer.domElement);

    // Adicionar controles de órbita
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.target.set(0, 0.5, 0); 

    // Luz ambiente
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5); 
    scene.add(ambientLight);

    // Luz direcional principal
    const directionalLight1 = new THREE.DirectionalLight(0xb0c4de, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    // Luz direcional secundária
    const directionalLight2 = new THREE.DirectionalLight(0xb0c4de, 1);
    directionalLight2.position.set(-5, 5, 5);
    scene.add(directionalLight2);

    // Luz direcional terciária
    const directionalLight4 = new THREE.DirectionalLight(0xb0c4de, 1);
    directionalLight4.position.set(-5, -5, 5);
    scene.add(directionalLight4);

    // Luz direcional de preenchimento
    const fillLight = new THREE.DirectionalLight(0xb0c4de, 2);
    fillLight.position.set(5, 0, -5);
    scene.add(fillLight);

    // Carregar o modelo glTF
    const gltfLoader = new THREE.GLTFLoader();
    let carro;
    let modelIndex = 0;
    const models = ['models/carro_cheio.glb', 'models/carro_contorno.glb'];

    function loadModel(modelPath) {
        console.log(`Tentando carregar o modelo: ${modelPath}`);

        // Remove o modelo anterior, se houver
        if (carro) {
            scene.remove(carro);
            carro.traverse(function(node) {
                if (node.isMesh) {
                    node.geometry.dispose();
                    node.material.dispose();
                }
            });
            carro = null;
        }

        gltfLoader.load(modelPath, function(gltf) {
            console.log('glTF carregado');
            carro = gltf.scene;
            
            //Ajusta posições 
            if (isMobile) {
                if (modelPath === models[1]) { 
                    carro.scale.set(0.1, 0.1, 0.1); // Ajustar a escala
                    carro.position.set(-1, -0.5, 0); // Ajustar a posição do carro
                    carro.rotation.y = 0; // Virado para a esquerda
                } else {
                    carro.scale.set(0.1, 0.1, 0.1); // Ajustar a escala
                    carro.position.set(0, -1.5, 0); // Ajustar a posição do carro
                    carro.rotation.y = 0; // Virado de lado
                }
            } else if (isTablet) {
                if (modelPath === models[1]) { 
                    carro.scale.set(0.1, 0.1, 0.1); // Ajustar a escala
                    carro.position.set(0, -0.5, 0); // Ajustar a posição do carro
                    carro.rotation.y = Math.PI + 1.7; // Virado para a esquerda
                } else {
                    carro.scale.set(0.1, 0.1, 0.1); // Ajustar a escala
                    carro.position.set(0, -1.5, 0); // Ajustar a posição do carro
                    carro.rotation.y = Math.PI / 2; // Virado de lado
                }
            } else {
                if (modelPath === models[1]) { 
                    carro.scale.set(0.1, 0.1, 0.1); // Ajustar a escala
                    carro.position.set(0, -0.5, 0); // Ajustar a posição do carro
                    carro.rotation.y = Math.PI + 1.7; // Virado para a esquerda
                } else {
                    carro.scale.set(0.1, 0.1, 0.1); // Ajustar a escala
                    carro.position.set(0, -1.5, 0); // Ajustar a posição do carro
                    carro.rotation.y = Math.PI / 2; // Virado de lado
                }
            }
             
            

            // Verifica se o modelo é o da Fórmula E para aplicar o material de contorno
            if (modelPath === models[1]) { // Se for carro_contorno
                const wireframeMaterial = new THREE.MeshBasicMaterial({
                    color: 0x696969, // Cor primária do contorno
                    wireframe: true,
                    wireframeLinewidth: 0.01 // Ajustar a largura da linha
                });

                carro.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.material = wireframeMaterial;
                    }
                });
            }

            // Adicionar o objeto à cena
            scene.add(carro);
            console.log('Carro adicionado à cena');

            // Remover indicador de carregamento
            document.getElementById('loading').style.display = 'none';

            // Função de animação
            function animate() {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            }

            animate();
        }, undefined, function(error) {
            console.error('Erro ao carregar o modelo:', error);
            document.getElementById('loading').textContent = 'Erro ao carregar o modelo.';
        });
    }

    // Carregar o modelo inicial
    loadModel(models[modelIndex]);

    // Ajustar tamanho
    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight * 0.8; // Ajustar altura
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // Ajustar posições 
    if (isMobile) {
        camera.position.set(0, 1.5, 2);
        controls.minDistance = 15;
        controls.maxDistance = 40;
    } else if (isTablet) {
        camera.position.set(0, 1.8, 3);
        controls.minDistance = 12;
        controls.maxDistance = 10;
    } else {
        camera.position.set(0, 2, 5); // Posição padrão para desktop
        controls.minDistance = 9; // Distância mínima
        controls.maxDistance = 40; // Distância máxima
    }

    // Rotação do carro
    document.getElementById('rotateLeftButton').addEventListener('click', () => {
        if (carro) {
            carro.rotation.y += Math.PI / 18;
        }
    });

    // Rotação para a direita
    document.getElementById('rotateRightButton').addEventListener('click', () => {
        if (carro) {
            carro.rotation.y -= Math.PI / 18;
        }
    });

    // Rotação para baixo
    document.getElementById('rotateDownButton').addEventListener('click', () => {
        if (carro) {
            carro.rotation.x -= Math.PI / 18;
        }
    });

    // Rotação para cima
    document.getElementById('rotateUpButton').addEventListener('click', () => {
        if (carro) {
            carro.rotation.x += Math.PI / 18;
        }
    });

    // Mudar a cor do carro
    function changeCarColor(color) {
        if (carro) {
            carro.traverse(function(node) {
                if (node.isMesh) {
                    console.log('Mudando a cor do material:', node.material);
                    node.material.color.setHex(parseInt(color.replace("#", "0x")));
                }
            });
        }
    }

    // Clicar nas cores
    const colorSquares = document.querySelectorAll('.color');
    colorSquares.forEach(square => {
        square.addEventListener('click', () => {
            const color = square.getAttribute('data-color');
            changeCarColor(color);
        });
    });

    // Limpar a cor
    document.getElementById('clearColorButton').addEventListener('click', () => {
        if (carro) {
            carro.traverse(function(node) {
                if (node.isMesh) {
                    console.log('Limpando a cor do material:', node.material);
                    if (modelIndex === 1) { // carro_contorno
                        node.material.color.set(0x696969); // Define a cor para vermelho
                    } else {
                        node.material.color.set(0xffffff); // Define a cor para branco
                    }
                }
            });
        }
    });

    // Trocar o modelo
    document.getElementById('changeModelButton').addEventListener('click', () => {
        console.log('Botão de troca de modelo clicado');
        modelIndex = (modelIndex + 1) % models.length; // Alternar entre os modelos
        loadModel(models[modelIndex]);
    });

    const showColorPickerButton = document.getElementById('showColorPickerButton');
    const colorSpectrum = document.getElementById('colorSpectrum');

    showColorPickerButton.addEventListener('click', () => {
        colorSpectrum.style.display = 'block';
        const rect = showColorPickerButton.getBoundingClientRect();
        colorSpectrum.style.top = `${rect.top - colorSpectrum.offsetHeight}px`;
        colorSpectrum.style.left = `${rect.left}px`;
    });

    colorSpectrum.addEventListener('click', (event) => {
        const canvas = document.createElement('canvas');
        canvas.width = colorSpectrum.offsetWidth;
        canvas.height = colorSpectrum.offsetHeight;
        const context = canvas.getContext('2d');
        
        // Desenhar o gradiente no canvas
        const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
        const colors = [
            "#FF0000", "#FF7F00", "#FFFF00", "#7FFF00", "#00FF00", 
            "#00FF7F", "#00FFFF", "#007FFF", "#0000FF", "#7F00FF", 
            "#FF00FF", "#FF007F"
        ];
        const step = 1 / (colors.length - 1);
        colors.forEach((color, index) => {
            gradient.addColorStop(step * index, color);
        });
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        const x = event.offsetX;
        const y = event.offsetY;
        const imageData = context.getImageData(x, y, 1, 1).data;
        const rgb = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

        changeCarColor(rgb);
        colorSpectrum.style.display = 'none';
    });

    function changeCarColor(color) {
        if (carro) {
            carro.traverse(function(node) {
                if (node.isMesh) {
                    node.material.color.set(color);
                }
            });
        }
    }
});
