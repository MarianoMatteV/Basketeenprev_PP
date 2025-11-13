// Configuração WebRTC
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

let socket;
let localStream;
let remoteStream;
let peerConnection;
let roomId;
let isAudioEnabled = true;
let isVideoEnabled = true;

// Elementos DOM
const roomSection = document.getElementById('roomSection');
const videoSection = document.getElementById('videoSection');
const roomInput = document.getElementById('roomInput');
const joinBtn = document.getElementById('joinBtn');
const createBtn = document.getElementById('createBtn');
const roomIdDisplay = document.getElementById('roomIdDisplay');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const toggleAudioBtn = document.getElementById('toggleAudio');
const toggleVideoBtn = document.getElementById('toggleVideo');
const hangupBtn = document.getElementById('hangupBtn');
const statusElement = document.getElementById('status');
const waitingMessage = document.getElementById('waitingMessage');

// Conectar ao servidor Socket.IO
function connectToServer() {
    const serverUrl = 'http://0.0.0.0:5000';
    socket = io(serverUrl);

    socket.on('connect', () => {
        console.log('Conectado ao servidor');
        updateStatus('Conectado ao servidor', true);
    });

    socket.on('created', (room) => {
        console.log('Sala criada:', room);
        roomId = room;
        showRoomId(room);
    });

    socket.on('joined', (room) => {
        console.log('Entrou na sala:', room);
        roomId = room;
        initializeMedia();
    });

    socket.on('ready', () => {
        console.log('Sala está pronta, criando oferta');
        createOffer();
    });

    socket.on('offer', async (offer) => {
        console.log('Oferta recebida');
        await handleOffer(offer);
    });

    socket.on('answer', async (answer) => {
        console.log('Resposta recebida');
        await handleAnswer(answer);
    });

    socket.on('ice-candidate', async (candidate) => {
        console.log('Candidato ICE recebido');
        await handleIceCandidate(candidate);
    });

    socket.on('user-disconnected', () => {
        console.log('Usuário desconectado');
        handleUserDisconnected();
    });

    socket.on('disconnect', () => {
        console.log('Desconectado do servidor');
        updateStatus('Desconectado', false);
    });

    socket.on('error', (error) => {
        console.error('Erro:', error);
        alert(error);
    });
}

// Atualizar status de conexão
function updateStatus(text, connected) {
    statusElement.querySelector('.status-text').textContent = text;
    if (connected) {
        statusElement.classList.add('connected');
    } else {
        statusElement.classList.remove('connected');
    }
}

// Criar sala
function createRoom() {
    const newRoomId = generateRoomId();
    socket.emit('create', newRoomId);
    initializeMedia();
}

// Entrar em uma sala
function joinRoom() {
    const room = roomInput.value.trim();
    if (!room) {
        alert('Por favor, digite um ID de sala');
        return;
    }
    socket.emit('join', room);
}

// Gerar ID de sala aleatório
function generateRoomId() {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
}

// Mostrar ID da sala criada
function showRoomId(room) {
    roomIdDisplay.innerHTML = `
        <strong>ID da Sala:</strong> ${room}<br>
        <small>Compartilhe este ID com outro usuário para iniciar a chamada</small>
    `;
    roomIdDisplay.classList.add('show');
}

// Inicializar mídia local
async function initializeMedia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: true
        });

        localVideo.srcObject = localStream;
        
        roomSection.style.display = 'none';
        videoSection.style.display = 'block';
        
        updateStatus('Na chamada', true);

        setupPeerConnection();
    } catch (error) {
        console.error('Erro ao acessar mídia:', error);
        alert('Erro ao acessar câmera e microfone. Verifique as permissões.');
    }
}

// Configurar conexão peer
function setupPeerConnection() {
    peerConnection = new RTCPeerConnection(configuration);

    // Adicionar tracks locais
    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    // Lidar com tracks remotos
    peerConnection.ontrack = (event) => {
        console.log('Track remoto recebido');
        if (!remoteStream) {
            remoteStream = new MediaStream();
            remoteVideo.srcObject = remoteStream;
        }
        remoteStream.addTrack(event.track);
        waitingMessage.classList.add('hidden');
    };

    // Lidar com candidatos ICE
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            console.log('Enviando candidato ICE');
            socket.emit('ice-candidate', {
                room: roomId,
                candidate: event.candidate
            });
        }
    };

    // Monitorar estado da conexão
    peerConnection.onconnectionstatechange = () => {
        console.log('Estado da conexão:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'connected') {
            updateStatus('Chamada conectada', true);
        } else if (peerConnection.connectionState === 'disconnected' || 
                   peerConnection.connectionState === 'failed') {
            handleUserDisconnected();
        }
    };
}

// Criar oferta
async function createOffer() {
    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        socket.emit('offer', {
            room: roomId,
            offer: offer
        });
    } catch (error) {
        console.error('Erro ao criar oferta:', error);
    }
}

// Lidar com oferta recebida
async function handleOffer(offer) {
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        socket.emit('answer', {
            room: roomId,
            answer: answer
        });
    } catch (error) {
        console.error('Erro ao lidar com oferta:', error);
    }
}

// Lidar com resposta recebida
async function handleAnswer(answer) {
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
        console.error('Erro ao lidar com resposta:', error);
    }
}

// Lidar com candidato ICE recebido
async function handleIceCandidate(candidate) {
    try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
        console.error('Erro ao adicionar candidato ICE:', error);
    }
}

// Alternar áudio
function toggleAudio() {
    isAudioEnabled = !isAudioEnabled;
    localStream.getAudioTracks().forEach(track => {
        track.enabled = isAudioEnabled;
    });
    
    toggleAudioBtn.classList.toggle('active', isAudioEnabled);
    toggleAudioBtn.title = isAudioEnabled ? 'Desligar microfone' : 'Ligar microfone';
}

// Alternar vídeo
function toggleVideo() {
    isVideoEnabled = !isVideoEnabled;
    localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoEnabled;
    });
    
    toggleVideoBtn.classList.toggle('active', isVideoEnabled);
    toggleVideoBtn.title = isVideoEnabled ? 'Desligar câmera' : 'Ligar câmera';
}

// Desligar chamada
function hangup() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
    
    if (peerConnection) {
        peerConnection.close();
    }
    
    socket.emit('leave', roomId);
    
    resetUI();
}

// Lidar com desconexão do usuário remoto
function handleUserDisconnected() {
    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
    }
    
    waitingMessage.classList.remove('hidden');
    waitingMessage.textContent = 'Participante desconectado';
    
    setTimeout(() => {
        hangup();
    }, 2000);
}

// Resetar interface
function resetUI() {
    roomSection.style.display = 'block';
    videoSection.style.display = 'none';
    roomIdDisplay.classList.remove('show');
    roomInput.value = '';
    waitingMessage.classList.remove('hidden');
    waitingMessage.textContent = 'Aguardando participante...';
    updateStatus('Desconectado', false);
    
    localStream = null;
    remoteStream = null;
    peerConnection = null;
    roomId = null;
    isAudioEnabled = true;
    isVideoEnabled = true;
}

// Event listeners
joinBtn.addEventListener('click', joinRoom);
createBtn.addEventListener('click', createRoom);
toggleAudioBtn.addEventListener('click', toggleAudio);
toggleVideoBtn.addEventListener('click', toggleVideo);
hangupBtn.addEventListener('click', hangup);

roomInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinRoom();
    }
});

// Inicializar conexão ao carregar
connectToServer();

// Limpar ao sair
window.addEventListener('beforeunload', () => {
    if (localStream) {
        hangup();
    }
});
