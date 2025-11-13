from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
from flask_cors import CORS
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = '35LfcqlAyCa2zVM5L159jciETtG_89w4pYHNADuUHyDy64HeX'
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True)

# Dicionário para rastrear salas e usuários
rooms_dict = {}

@app.route('/')
def index():
    return '''
    <h1>Servidor de Videochamada WebRTC</h1>
    <p>Servidor está rodando! Abra videocall.html no navegador para iniciar uma chamada.</p>
    <p>Use Ngrok para expor este servidor: <code>ngrok http 5000</code></p>
    '''

@socketio.on('connect')
def handle_connect():
    logger.info(f'Cliente conectado: {request.sid}')
    emit('connect', {'sid': request.sid})

@socketio.on('disconnect')
def handle_disconnect():
    logger.info(f'Cliente desconectado: {request.sid}')
    
    # Remover usuário de todas as salas
    user_rooms = [room for room in rooms() if room != request.sid]
    for room in user_rooms:
        if room in rooms_dict:
            if request.sid in rooms_dict[room]:
                rooms_dict[room].remove(request.sid)
                
                # Notificar outros usuários na sala
                emit('user-disconnected', room=room, skip_sid=request.sid)
                
                # Limpar sala se estiver vazia
                if len(rooms_dict[room]) == 0:
                    del rooms_dict[room]
                    logger.info(f'Sala {room} removida (vazia)')

@socketio.on('create')
def handle_create(room):
    logger.info(f'Criando sala: {room} por {request.sid}')
    
    if room in rooms_dict:
        emit('error', 'Sala já existe')
        return
    
    rooms_dict[room] = [request.sid]
    join_room(room)
    emit('created', room)
    logger.info(f'Sala {room} criada com sucesso')

@socketio.on('join')
def handle_join(room):
    logger.info(f'Tentando entrar na sala: {room} por {request.sid}')
    
    if room not in rooms_dict:
        emit('error', 'Sala não existe')
        return
    
    if len(rooms_dict[room]) >= 2:
        emit('error', 'Sala está cheia')
        return
    
    rooms_dict[room].append(request.sid)
    join_room(room)
    
    # Notificar o usuário que entrou
    emit('joined', room)
    
    # Notificar todos na sala que estão prontos
    emit('ready', room=room, skip_sid=request.sid)
    logger.info(f'Usuário {request.sid} entrou na sala {room}')

@socketio.on('offer')
def handle_offer(data):
    room = data['room']
    offer = data['offer']
    logger.info(f'Oferta recebida para sala: {room}')
    emit('offer', offer, room=room, skip_sid=request.sid)

@socketio.on('answer')
def handle_answer(data):
    room = data['room']
    answer = data['answer']
    logger.info(f'Resposta recebida para sala: {room}')
    emit('answer', answer, room=room, skip_sid=request.sid)

@socketio.on('ice-candidate')
def handle_ice_candidate(data):
    room = data['room']
    candidate = data['candidate']
    logger.info(f'Candidato ICE recebido para sala: {room}')
    emit('ice-candidate', candidate, room=room, skip_sid=request.sid)

@socketio.on('leave')
def handle_leave(room):
    logger.info(f'Usuário {request.sid} saindo da sala: {room}')
    
    if room in rooms_dict and request.sid in rooms_dict[room]:
        rooms_dict[room].remove(request.sid)
        leave_room(room)
        
        # Notificar outros usuários
        emit('user-disconnected', room=room, skip_sid=request.sid)
        
        # Limpar sala se estiver vazia
        if len(rooms_dict[room]) == 0:
            del rooms_dict[room]
            logger.info(f'Sala {room} removida (vazia)')

if __name__ == '__main__':
    logger.info('Iniciando servidor WebRTC na porta 5000...')
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)

