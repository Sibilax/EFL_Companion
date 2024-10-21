from extensions import db  
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  # para generar tokens JWT, además así no necesito cargar ni la clave secreta (JWT_SECRET_KEY) ni el algoritmo de encriptación pq los coge de config y app
from werkzeug.security import check_password_hash, generate_password_hash  # Para verificar contraseñas encriptadas y para encriptar la nueva
from datetime import datetime, timedelta  # para manejar la expiración del token
from marshmallow import ValidationError

from schemas.user_schema import user_schema
from schemas.admin_schema import admin_schema
from models.user import User
from models.admin import Admin

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=["POST"])
def login():
    user_email = request.json.get('user_email')
    admin_email = request.json.get('admin_email')
    password = request.json.get('user_pwd') or request.json.get('admin_pwd')

    if not password:
        return jsonify({"error": "Please provide both email and password"}), 400

    if user_email:
        user = User.query.filter_by(user_email=user_email).first()

        if user and check_password_hash(user.user_pwd, password):
            token = create_access_token(identity={'user_id': user.user_id, 'role': 'user'},
                                        expires_delta=timedelta(hours=24))
            return jsonify({"token": token, "message": f"Welcome {user.user_name}"}), 200

        return jsonify({"error": "Incorrect credentials"}), 401

    elif admin_email:
        admin = Admin.query.filter_by(admin_email=admin_email).first()

        if admin and check_password_hash(admin.admin_pwd, password):
            token = create_access_token(identity={'admin_id': admin.admin_id, 'role': 'admin'},
                                        expires_delta=timedelta(hours=24))
            return jsonify({"token": token, "message": f"Welcome admin: {admin.admin_name}"}), 200

        return jsonify({"error": "Incorrect credentials"}), 401

    return jsonify({"error": "Please provide both email and password"}), 400




@login_bp.route('/login/change-pwd', methods=['PUT'])
@jwt_required()  # Para que el usuario/admin esté autenticado antes de realizar la operación
def change_password():
    identity = get_jwt_identity()  # Obtiene la identidad del token (puede ser usuario o admin)
    role = identity['role']  # Obtiene el rol (user o admin) que definí en login
    
    current_password = request.json.get('current_password')  # Obtengo datos para el cambio
    new_password = request.json.get('new_password')  

    if not current_password or not new_password:
        return jsonify({"error": "Please provide both current and new passwords"}), 400

    # Verifico si es un usuario o un administrador y buscar en la tabla correspondiente
    if role == 'user':
        user = User.query.get(identity['user_id'])  # Busco en la tabla de usuarios
        if not user:
            return jsonify({"error": "User not found"}), 404
        if not check_password_hash(user.user_pwd, current_password):  # Compruebo la contraseña actual
            return jsonify({"error": "Incorrect current password"}), 401

        
        try:
            validated_data = user_schema.load({'user_pwd': new_password}, partial=True) # Valido la nueva contraseña usando el esquema, partial= True para que solo verifique eso y no todo el esquema
        except ValidationError as e:
            return jsonify(e.messages), 400
        
        
        user.user_pwd = generate_password_hash(new_password) # Encriptar la nueva contraseña y actualizar

    elif role == 'admin':
        admin = Admin.query.get(identity['admin_id'])  
        if not admin:
            return jsonify({"error": "Admin not found"}), 404
        if not check_password_hash(admin.admin_pwd, current_password):  
            return jsonify({"error": "Incorrect current password"}), 401


        try:
            validated_data = admin_schema.load({'admin_pwd': new_password}, partial=True)  
        except ValidationError as e:
            return jsonify(e.messages), 400
        
        admin.admin_pwd = generate_password_hash(new_password)

    else:
        return jsonify({"error": "Invalid role"}), 400  # Si el rol no es ni user ni admin

    try:
        db.session.commit()
        return jsonify({"message": "Password updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to update password"}), 500
