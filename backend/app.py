
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from config import Config

from flask_cors import CORS 
from extensions import db
from controllers import (
    user_bp, blog_bp, curso_bp, video_bp, login_bp, admin_bp,
    respuesta_bp, pregunta_bp, searchbar_bp, tag_bp
)

load_dotenv()

app = Flask(__name__)

app.config.from_object(Config)
app.config['JWT_ALGORITHM'] = 'HS256'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
app.config['SQLALCHEMY_ECHO'] = True
CORS(app)
db.init_app(app)

ma = Marshmallow(app)
migrate = Migrate(app, db)
jwt = JWTManager(app) 



blueprints = [
    tag_bp, user_bp, blog_bp, curso_bp, video_bp, login_bp, 
    admin_bp, respuesta_bp, pregunta_bp, searchbar_bp
]

for bp in blueprints:
    app.register_blueprint(bp)

    
@app.route('/')
def home():
    return "EFL Companion"

if __name__ == "__main__":
    with app.app_context():
        #db.create_all() - no debe ir a producción o se crearán las tablas automáticamente cada vez que se inicie la app
        app.run(debug=False)   #para producción false

         #TODO IMPORTANTE: Configurar variables de entorno
         #TODO CORS (Cross-Origin Resource Sharing) EDITAR AL DOMINIO DE PRODUCCIÓN y desde el front


