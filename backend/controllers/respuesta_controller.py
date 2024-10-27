from flask import Blueprint, request, jsonify
from extensions import db  
from marshmallow.exceptions import ValidationError
from sqlalchemy.exc import IntegrityError
import csv

from models.quiz_respuesta import QuizRespuesta
from schemas.quiz_respuesta_schema import quiz_respuesta_schema, quiz_respuestas_schema  
from decorators.admin_permits import admin_permits

respuesta_bp = Blueprint('respuesta', __name__)


@respuesta_bp.route('/respuestas/csv', methods=["POST"])
@admin_permits
def register_question_csv():
    file = request.files.get('file')

    if not file or file.filename == '':
        return jsonify({"error": "No file has been selected"}), 400

    if file and file.filename.endswith('.csv'):
        try:
            csv_file = csv.reader(file.stream.read().decode('utf-8-sig').splitlines())
            next(csv_file)

            answers = []

            for row in csv_file:
                if len(row) < 4:
                    continue

                quiz_respuesta_opcion, quiz_respuesta_contenido, quiz_respuesta_correcta, quiz_respuesta_pregunta_id = row

                # Validaciones
                if not quiz_respuesta_opcion or not quiz_respuesta_contenido:
                    raise ValueError("Invalid data: empty option or content.")

                quiz_respuesta_correcta = int(quiz_respuesta_correcta)  # sin esto no funciona
                quiz_respuesta_pregunta_id = int(quiz_respuesta_pregunta_id)  # en los anteriores funcionó porque el id se generaba automáticamente

                answers.append({
                    "opcion": quiz_respuesta_opcion, 
                    "contenido": quiz_respuesta_contenido, 
                    "isCorrect": quiz_respuesta_correcta, 
                    "questionID": quiz_respuesta_pregunta_id
                })

            for answer_data in answers:
                new_answer = QuizRespuesta(
                    quiz_respuesta_opcion=answer_data["opcion"],
                    quiz_respuesta_contenido=answer_data["contenido"],
                    quiz_respuesta_correcta=answer_data["isCorrect"],
                    quiz_respuesta_pregunta_id=answer_data["questionID"],
                )

                db.session.add(new_answer)

            db.session.commit()

            return jsonify({"message": "Answer added successfully"}), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e), "message": "An error occurred while processing the CSV."}), 500

    return jsonify({"error": "Invalid file format"}), 400



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
    limit = request.args.get('limit', default=20, type=int)
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

        if respuesta is not None:
            answer.quiz_respuesta_contenido = respuesta
        if es_correcta is not None:  # Tener en cuenta que es_correcta puede ser False
            answer.quiz_respuesta_correcta = es_correcta
        if respuesta_opcion is not None:
            answer.quiz_respuesta_opcion = respuesta_opcion

        db.session.commit()
        return jsonify({"message": "Answer updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500