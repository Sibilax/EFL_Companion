from flask import Blueprint, request, jsonify
from extensions import db  
from marshmallow.exceptions import ValidationError
from sqlalchemy.exc import IntegrityError

from models.curso import Curso
from schemas.curso_schema import curso_schema, cursos_schema  
from decorators.admin_permits import admin_permits

curso_bp = Blueprint('curso', __name__)

@curso_bp.route('/curso', methods=["POST"])
@admin_permits
def create_curso():

    name = request.json.get('curso_name')
    description = request.json.get('curso_description')
    level = request.json.get('curso_level')

    if not name or not description or not level:
        return jsonify({"error": "Please check the required fields"}), 400
          
    try:
        new_curso = Curso(name, description, level)

        db.session.add(new_curso)
        db.session.commit()

        return jsonify({"message": "Curso created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    



@curso_bp.route('/curso/<int:curso_id>', methods=['GET'])
def get_curso(curso_id):
    
    curso = Curso.query.get(curso_id)
    if not curso:
        return jsonify({'error': 'Course not found'}), 404
    return jsonify(curso_schema.dump(curso))




@curso_bp.route('/cursos', methods=['GET'])
def get_cursos():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    cursos = Curso.query.limit(limit).offset(offset).all()
    
    if not cursos:
        return jsonify({'error': 'No courses found'}), 404  

    return jsonify(cursos_schema.dump(cursos))




@curso_bp.route('/curso/<int:curso_id>', methods=["DELETE"])
@admin_permits 
def delete_curso(curso_id):
    try:
        curso = Curso.query.get(curso_id)
        if not curso:
            return jsonify({"error": "Course not found"}), 404

        db.session.delete(curso)
        db.session.commit()

        return jsonify({"message": "Course deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@curso_bp.route('/cursos', methods=["DELETE"])
@admin_permits 
def delete_all_cursos():
    try:
        Curso.query.delete()
        db.session.commit()

        return jsonify({"message": "All courses deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@curso_bp.route('/curso/<int:curso_id>', methods=["PUT"])
@admin_permits 
def update_curso(curso_id):
    name = request.json.get('curso_name')
    description = request.json.get('curso_description')
    level = request.json.get('curso_level')

    try:
        curso = Curso.query.get(curso_id)
        if not curso:
            return jsonify({"error": "Course not found"}), 404

        if name:
            curso.curso_name = name
        if description:
            curso.curso_description = description
        if level:
            curso.curso_level = level

        db.session.commit()
        return jsonify({"message": "Course updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

