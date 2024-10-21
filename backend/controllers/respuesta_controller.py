from flask import Blueprint, request, jsonify
from extensions import db  
from marshmallow.exceptions import ValidationError
from sqlalchemy.exc import IntegrityError

from models.quiz_respuesta import QuizRespuesta
from schemas.quiz_respuesta_schema import quiz_respuesta_schema, quiz_respuestas_schema  
from decorators.admin_permits import admin_permits

respuesta_bp = Blueprint('respuesta', __name__)

@respuesta_bp.route('/respuesta', methods=["POST"])
@admin_permits
def create_answer():

    respuesta = request.json.get('quiz_respuesta_contenido')
    es_correcta = request.json.get('quiz_respuesta_correcta')
    respuesta_pregunta_id = request.json.get('quiz_respuesta_pregunta_id')
    respuesta_opcion = request.json.get('quiz_respuesta_opcion')

    if not respuesta or not es_correcta or not respuesta_pregunta_id or not respuesta_opcion:
        return jsonify({"error": "Please check the required fields"}), 400
          
    try:
        new_answer = QuizRespuesta(
            quiz_respuesta_contenido=respuesta,
            quiz_respuesta_correcta=es_correcta,
            quiz_respuesta_pregunta_id=respuesta_pregunta_id,
            quiz_respuesta_opcion=respuesta_opcion
        )

        db.session.add(new_answer)
        db.session.commit()

        return jsonify({"message": "Answer created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@respuesta_bp.route('/respuesta/<int:quiz_respuesta_id>', methods=['GET'])
def get_quiz_respuesta(quiz_respuesta_id):
    respuesta = QuizRespuesta.query.get(quiz_respuesta_id)
    if not respuesta:
        return jsonify({'error': 'Answer not found'}), 404
    return jsonify(quiz_respuesta_schema.dump(respuesta))




@respuesta_bp.route('/respuestas', methods=['GET'])
def get_respuestas():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    respuestas = QuizRespuesta.query.limit(limit).offset(offset).all()
    if not respuestas:
        return jsonify({'error': 'No answers found'}), 404  
    return jsonify(quiz_respuestas_schema.dump(respuestas))




@respuesta_bp.route('/pregunta/<int:pregunta_id>/respuestas', methods=['GET'])
def get_respuestas_por_pregunta(pregunta_id):
    respuestas = QuizRespuesta.query.filter_by(quiz_respuesta_pregunta_id=pregunta_id).all()
    
    if not respuestas:
        return jsonify({'error': 'No answers found for this question'}), 404

    return jsonify(quiz_respuestas_schema.dump(respuestas))




@respuesta_bp.route('/respuesta/<int:quiz_respuesta_id>', methods=["DELETE"])
@admin_permits 
def delete_respuesta(quiz_respuesta_id):
    try:
        respuesta = QuizRespuesta.query.get(quiz_respuesta_id)
        if not respuesta:
            return jsonify({"error": "Answer not found"}), 404

        db.session.delete(respuesta)
        db.session.commit()

        return jsonify({"message": "Answer deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@respuesta_bp.route('/respuestas', methods=["DELETE"])
@admin_permits 
def delete_all_respuestas():
    try:
        QuizRespuesta.query.delete()
        db.session.commit()

        return jsonify({"message": "All respuestas deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@respuesta_bp.route('/respuesta/<int:quiz_respuesta_id>', methods=["PUT"])
@admin_permits 
def update_respuesta(quiz_respuesta_id):
    respuesta = request.json.get('quiz_respuesta_contenido')
    es_correcta = request.json.get('quiz_respuesta_correcta')
    respuesta_opcion = request.json.get('quiz_respuesta_opcion')

    try:
        answer = QuizRespuesta.query.get(quiz_respuesta_id)
        if not answer:
            return jsonify({"error": "Respuesta not found"}), 404

        if respuesta:
            answer.quiz_respuesta_contenido = respuesta
        if es_correcta is not None:  # Tener en cuenta que es_correcta puede ser False
            answer.quiz_respuesta_correcta = es_correcta
        if respuesta_opcion:
            answer.quiz_respuesta_opcion = respuesta_opcion

        db.session.commit()
        return jsonify({"message": "Answer updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500