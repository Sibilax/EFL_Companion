
from flask import request, jsonify, current_app
from functools import wraps  # Para poder usar el decorador wraps
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  # Para trabajar con JSON Web Tokens

load_dotenv()
load_dotenv()

# Decorador para verificar si el usuario es admin (similar a un HOC, es una función que da funcionalidades extra a otra sin modificarla) @admin_permits 
def admin_permits(func):
    @wraps(func)
    @jwt_required()  # Protege la ruta y valida automáticamente el token JWT
    def admin_access_only(*args, **kwargs):
        current_user = get_jwt_identity()  # Obtiene la identidad desde el token JWT
        
        # Verificar si el rol del usuario es "admin"
        if current_user.get('role') != 'admin':
            return jsonify({"error": "You do not have permission to access this route"}), 403
        
        return func(*args, **kwargs)  # Ejecuta la función original sólo si es admin
    
    return admin_access_only

