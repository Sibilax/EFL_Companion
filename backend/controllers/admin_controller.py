from flask import Blueprint, request, jsonify
from extensions import db  
from marshmallow.exceptions import ValidationError
from sqlalchemy.exc import IntegrityError

from models.admin import Admin
from schemas.admin_schema import admin_schema, admins_schema  
from decorators.admin_permits import admin_permits

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin', methods=["POST"])
@admin_permits 
def create_admin():

    name = request.json.get('admin_name')
    email = request.json.get('admin_email')
    password = request.json.get('admin_pwd')
    role = request.json.get('admin_role')

    if not name or not email or not password or not role:
        return jsonify({"error": "Please check the required fields"}), 400


    try:  # hay que implementar aquí la validación, si no la validación del esquema no se aplica y la solicitud post se crea igual aunque no se cumpla el criterio 
        data = {
            'admin_name': name,
            'admin_email': email,
            'admin_pwd': password,
            'admin_role': role
        }
        
        validated_data = admin_schema.load(data)
        
    except ValidationError as err:
        return jsonify({
            "error": "Validation failed",
            "fields": err.messages  # Para poder devolver el mensaje de error con el campo que falló
        }), 400
    
        
    try:
        new_admin = Admin(admin_name=name, admin_email=email, admin_pwd=password, admin_role=role)
        new_admin.set_password(password)  # Encriptar la contraseña antes de guardar

        db.session.add(new_admin)
        db.session.commit()

        return jsonify({"message": "Admin created successfully"}), 201

    except IntegrityError:
        db.session.rollback()  
        return jsonify({"error": "El email ya está registrado."}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@admin_bp.route('/admin/<int:admin_id>', methods=['GET'])
@admin_permits 
def get_admin(admin_id):
   
    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({'error': 'Admin not found'}), 404
    return jsonify(admin_schema.dump(admin))




@admin_bp.route('/admins', methods=['GET'])
@admin_permits 
def get_admins():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    admins = Admin.query.limit(limit).offset(offset).all()
    if not admins:
        return jsonify({'error': 'No admins found'}), 404  
    return jsonify(admins_schema.dump(admins))




@admin_bp.route('/admin/<int:admin_id>', methods=["DELETE"])
@admin_permits 
def delete_admin(admin_id):
    try:
        admin = Admin.query.get(admin_id)
        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        db.session.delete(admin)
        db.session.commit()

        return jsonify({"message": "Admin deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@admin_bp.route('/admins', methods=["DELETE"])
@admin_permits 
def delete_all_admins():
    try:
        Admin.query.delete()
        db.session.commit()

        return jsonify({"message": "All admins deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@admin_bp.route('/admin/<int:admin_id>', methods=["PUT"])
@admin_permits
def update_admin(admin_id):
    name = request.json.get('admin_name')
    email = request.json.get('admin_email')
    password = request.json.get('admin_pwd')
    role = request.json.get('admin_role')

    try:
        admin = Admin.query.get(admin_id)
        if not admin:
            return jsonify({"error": "Admin not found"}), 404

        if name:
            admin.admin_name = name
        if email:
            admin.admin_email = email
        if password:
            admin.set_password(password)  # Hay q encriptarlo
        if role:
            admin.admin_role = role

        db.session.commit()
        return jsonify({"message": "Admin updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

