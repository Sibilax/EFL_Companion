from flask import Blueprint, request, jsonify 
from extensions import db  
from marshmallow.exceptions import ValidationError
from sqlalchemy.exc import IntegrityError

from models.user import User
from schemas.user_schema import user_schema, users_schema 
from decorators.admin_permits import admin_permits

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=["POST"])
def register_user():

    name = request.json.get('user_name')
    email = request.json.get('user_email')
    password = request.json.get('user_pwd')

    if not name or not email or not password:
        return jsonify({"error": "Please check the required fields"}), 400

    try:  # hay que implementar aquí la validación, si no la validación del esquema no se aplica y la solicitud POST se crea igual aunque no se cumpla el criterio 
        data = {
            'user_name': name,
            'user_email': email,
            'user_pwd': password
        }
        
        validated_data = user_schema.load(data)
        
    except ValidationError as err:
        return jsonify(err.messages), 400  # Devuelve los errores de validación
    
    try:
        # Crear el nuevo usuario (la encriptación ocurre en el modelo)
        new_user = User(user_name=validated_data['user_name'], user_email=validated_data['user_email'], user_pwd=validated_data['user_pwd'])

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201

    except IntegrityError:
        db.session.rollback()  
        return jsonify({"error": "The email is already registered"}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@user_bp.route('/user', methods=["POST"])
@admin_permits  # Aqui paso el decorador (HOC simil) que envuelve a esta función y con la verificaciónde permisos anteriro solo permite el acceso a la ruta si es admin
def create_user():

    name = request.json.get('user_name')
    email = request.json.get('user_email')
    password = request.json.get('user_pwd')

    if not name or not email or not password:
        return jsonify({"error": "Please check the required fields"}), 400
    
    try:  # hay que implementar aquí la validación, si no la validación del esquema no se aplica y la solicitud post se crea igual aunque no se cumpla el criterio 
        data = {
            'user_name': name,
            'user_email': email,
            'user_pwd': password
        }
        
        validated_data = user_schema.load(data)
        
    except ValidationError as err:
        return jsonify({
            "error": "Validation failed",
            "fields": err.messages  
        }), 400
    
    try:
        new_user = User(user_name=validated_data['user_name'], user_email=validated_data['user_email'], user_pwd=validated_data['user_pwd'])

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201

    except IntegrityError:
        db.session.rollback()  
        return jsonify({"error": "The email is already registered"}), 400
          
    try:
        new_user = User(user_name=name,user_email=email,user_pwd= password)

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully"}), 201
    
    except IntegrityError:
        db.session.rollback()  
        return jsonify({"error": "The email is already registered"}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@user_bp.route('/user/<int:user_id>', methods=['GET'])
@admin_permits 
def get_user(user_id):
   
    user = User.query.get(user_id)

    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user_schema.dump(user))




@user_bp.route('/users', methods=['GET'])
@admin_permits 
def get_users():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    users = User.query.limit(limit).offset(offset).all()

    if not users:
        return jsonify({'error': 'No users found'}), 404  
    return jsonify(users_schema.dump(users))




@user_bp.route('/user/<int:user_id>', methods=["DELETE"])
@admin_permits 
def delete_user(user_id):
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({"message": "User deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@user_bp.route('/users', methods=["DELETE"])
@admin_permits 
def delete_all_users():
    try:
        User.query.delete()
        db.session.commit()

        return jsonify({"message": "All users deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@user_bp.route('/user/<int:user_id>', methods=["PUT"])
@admin_permits 
def update_user(user_id):
    name = request.json.get('user_name')
    email = request.json.get('user_email')
    password = request.json.get('user_pwd')
    status = request.json.get('user_status')

    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        if name:
            user.user_name = name
        if email:
            user.user_email = email
        if password:
            user.user_pwd = password
        if status:
            user.user_status = status

        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


