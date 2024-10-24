from flask import Blueprint, request, jsonify
from extensions import db  
from marshmallow.exceptions import ValidationError
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload  #para que devuelva respuestas y preguntas juntas sin tener que usar append
import csv

from models.quiz_pregunta import QuizPregunta
from models.quiz_respuesta import QuizRespuesta
from schemas.quiz_respuesta_schema import quiz_respuesta_schema, quiz_respuestas_schema  
from schemas.quiz_pregunta_schema import quiz_pregunta_schema, quiz_preguntas_schema  
from decorators.admin_permits import admin_permits

pregunta_bp = Blueprint('pregunta', __name__)


@pregunta_bp.route('/preguntas/csv', methods=["POST"])
@admin_permits 
def register_question_csv():
    file = request.files.get('file') # almaceno en la variable file el elemento con nombre 'file' obtenido de la request

    if not file or file.filename == '':  #ese file(s) hace referencia al nombre del input desde el frontend y deben coincidir
        return jsonify({"error": "No selected file"}), 400  #filename, propiedad de los objetos file q devuelve el nombre, extensión inclída


    if file and file.filename.endswith('.csv'):
        try:
            # Leer el archivo CSV, es decir, accede al contenido
            csv_file = csv.reader(file.stream.read().decode('utf-8-sig').splitlines()) # utilizo la biblioteca csv de py. file.stream.read() accede a todo el contenido, convierte a cadena de texto utf-8 y split cada cadena en lineas d e text individuales 
            next(csv_file)  # o sea que va a separar la contraseña el nombre, etc en elementos independientes y next hace q salte al siguiente elemento iterable

            questions = []  # Inicializo la lista para almacenar diccionarios

            for row in csv_file:
                if len(row) < 2:
                    continue 
                quiz_pregunta_nivel, quiz_pregunta_contenido = row #asigno cada elemento de row a una variable, deben coincidir con el orden en q se almacenaron en el csv
                questions.append({"nivel": quiz_pregunta_nivel, "pregunta": quiz_pregunta_contenido}) #convierto a diccionario y almaceno c/variable como valor. estos diccionarios se almacenan en la lista [] users

            for question_data in questions:
                new_question = QuizPregunta(
                    quiz_pregunta_nivel=question_data["nivel"],
                    quiz_pregunta_contenido=question_data["pregunta"] #se encripta en el modelo
                    
                )

                db.session.add(new_question)  # Agrego el nuevo usuario a la sesión de la base de datos

            db.session.commit()  # Realiza la transacción

            return jsonify({"message": "Questions added successfully"}), 201

        except Exception as e:
            db.session.rollback()  # Revierte la transacción en caso de error
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Invalid file format"}), 400           


@pregunta_bp.route('/pregunta', methods=["POST"])
@admin_permits
def create_question():

    nivel = request.json.get('quiz_pregunta_nivel')
    pregunta = request.json.get('quiz_pregunta_contenido')


    if not nivel or not pregunta:
        return jsonify({"error": "Please check the required fields"}), 400
          
    try:
        new_question = QuizPregunta(nivel, pregunta)

        db.session.add(new_question)
        db.session.commit()    
        
        return jsonify({"message": "Question created successfully"}), 201


    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@pregunta_bp.route('/pregunta/<int:quiz_pregunta_id>', methods=['GET'])
def get_pregunta(quiz_pregunta_id):
    pregunta = QuizPregunta.query.get(quiz_pregunta_id)
    
    if not pregunta:
        return jsonify({'error': 'Question not found'}), 404
    return  jsonify(quiz_pregunta_schema.dump(pregunta))




@pregunta_bp.route('/preguntas', methods=['GET'])
def get_preguntas():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    preguntas = QuizPregunta.query.limit(limit).offset(offset).all()
    if not preguntas:
        return jsonify({'error': 'No questions found'}), 404  
    return jsonify(quiz_preguntas_schema.dump(preguntas))



#sin filtrar por nivel
@pregunta_bp.route('/preguntas_con_respuestas_todas', methods=['GET'])
def get_preguntas_con_respuestas_todas():
    limit_preguntas = request.args.get('limit_preguntas', default=15, type=int)
    offset = request.args.get('offset', default=0, type=int)

    # Uso joinedload para obtener todas las preguntas y respuestas en una sola consulta
    preguntas = QuizPregunta.query.options(joinedload(QuizPregunta.respuestas)).limit(limit_preguntas).offset(offset).all() # verifico desde postman:  http://localhost:5000/preguntas_con_respuestas?limit_preguntas=15&offset=15
     #options() para pasar instrucciones especificas de que como cargar y procesar los datos, en este caso con jonedload, respuestas = relación definida en el esquema de 1 a muchos

    if not preguntas:
        return jsonify({'error': 'No questions found'}), 404

    resultado = []  # Almacena el resultado con preguntas y respuestas
    for pregunta in preguntas:
        resultado.append({
            'pregunta': quiz_pregunta_schema.dump(pregunta),
            'respuestas': quiz_respuestas_schema.dump(pregunta.respuestas) #hago append de las respuestas vinculadas que recibí gracias a joinload, almaceno dos listas, una dentro de otra
        })

    return jsonify(resultado)



@pregunta_bp.route('/preguntas_con_respuestas', methods=['GET'])
def get_preguntas_con_respuestas():
    nivel = request.args.get('nivel', default=None, type=str)
    limit_preguntas = request.args.get('limit_preguntas', default=15, type=int)
    offset = request.args.get('offset', default=0, type=int)

    # Filtro por nivel si se proporciona
    query = QuizPregunta.query.options(joinedload(QuizPregunta.respuestas))
    if nivel:
        query = query.filter_by(quiz_pregunta_nivel=nivel)

    preguntas = query.limit(limit_preguntas).offset(offset).all()

    if not preguntas:
        return jsonify({'error': 'No questions found for this level'}), 404

    resultado = []
    for pregunta in preguntas:
        resultado.append({
            'pregunta': quiz_pregunta_schema.dump(pregunta),
            'respuestas': quiz_respuestas_schema.dump(pregunta.respuestas)
        })

    return jsonify(resultado), 200  # Aseguramos que el código 200 se envía en caso de éxito





@pregunta_bp.route('/pregunta/<int:quiz_pregunta_id>', methods=["DELETE"])
@admin_permits 
def delete_pregunta(quiz_pregunta_id):
    try:
        pregunta = QuizPregunta.query.get(quiz_pregunta_id)
        if not pregunta:
            return jsonify({"error": "Question not found"}), 404

        db.session.delete(pregunta)  # importante:  sólo borra resp he marcado on cascade en el modelo de la pregunta, así aparece en la FK de la bd
        db.session.commit()

        return jsonify({"message": "Question and associated answers deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@pregunta_bp.route('/preguntas', methods=["DELETE"])
@admin_permits 
def delete_all_preguntas():
    try:
        QuizPregunta.query.delete()
        db.session.commit()

        return jsonify({"message": "All questions deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@pregunta_bp.route('/pregunta/<int:quiz_pregunta_id>', methods=["PUT"])
@admin_permits 
def update_pregunta(quiz_pregunta_id):
    nivel = request.json.get('quiz_pregunta_nivel')
    pregunta = request.json.get('quiz_pregunta_contenido')

    try:
        question = QuizPregunta.query.get(quiz_pregunta_id)
        if not question:
            return jsonify({"error": "Question not found"}), 404

        if nivel:
            question.quiz_pregunta_nivel = nivel
        if pregunta:
            question.quiz_pregunta_contenido = pregunta

        db.session.commit()
        return jsonify({"message": "Question updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




