from flask import Blueprint, request, jsonify
from extensions import db  
from marshmallow.exceptions import ValidationError
from sqlalchemy.exc import IntegrityError

from models.curso import Curso   
from models.blog import Blog   
from models.video import Video   
from models.quiz_pregunta import QuizPregunta   
from models.tag import Tag
from schemas.tag_schema import tag_schema, tags_schema  
from decorators.admin_permits import admin_permits

tag_bp = Blueprint('tag', __name__)

@tag_bp.route('/tag', methods=["POST"])
@admin_permits 
def assign_tag():

    tag_input = request.json.get('tag_name')
    resource_input = request.json.get('resource')
    resource_id_input = request.json.get('resource_id')

    if not tag_input or not resource_input or not resource_id_input:
        return jsonify({"error": "Please check the required fields"}), 400
    
    try:
        resource_id_input = int(resource_id_input)

    except ValueError:
        return jsonify({"error": "Resource ID must be an integer"}), 400

    try:

        tag = Tag.query.filter_by(tag_name=tag_input).first() #verifico q exista

        if not tag:
            tag = Tag(tag_name=tag_input)

        accepted_resources = {
            'curso': (Curso, 'tag_curso_id', 'curso_id'),
            'blog': (Blog, 'tag_blog_id', 'blog_id'),
            'video': (Video, 'tag_video_id', 'video_id'),
            'pregunta': (QuizPregunta, 'tag_quiz_pregunta_id', 'quiz_pregunta_id')
        }

        if resource_input not in accepted_resources:
            return jsonify({"error": "Invalid resource type"}), 400


        if resource_input == 'curso':
            curso = Curso.query.get(resource_id_input)
            if not curso:
                return jsonify({"error": "Course not found"}), 404

            tag.tag_curso_id = curso.curso_id 


        elif resource_input == 'blog':
            blog = Blog.query.get(resource_id_input)
            if not blog:
                return jsonify({"error": "Blog not found"}), 404

            tag.tag_blog_id = blog.blog_id 

        
        elif resource_input == 'video':
            video = Video.query.get(resource_id_input)
            if not video:
                return jsonify({"error": "Video not found"}), 404

            tag.tag_video_id = video.video_id


        elif resource_input == 'pregunta':
            pregunta = QuizPregunta.query.get(resource_id_input)
            if not pregunta:
                return jsonify({"error": "Question not found"}), 404

            tag.tag_quiz_pregunta_id = pregunta.quiz_pregunta_id
                    
        db.session.add(tag)
        db.session.commit()
        
        return jsonify({"message": "Tag added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



@tag_bp.route('/tags', methods=["GET"])   
def get_all_tags():
    try:
        tags = Tag.query.all()   
        return jsonify(tags_schema.dump(tags)), 200   
    except Exception as e:
        return jsonify({"error": str(e)}), 500   



@tag_bp.route('/tag/<int:tag_id>', methods=['GET']) 
def get_specific_tag(tag_id):
    tag = Tag.query.get(tag_id)

    if not tag:
        return jsonify({'message': 'Tag not found'}), 404
    return jsonify(tag_schema.dump(tag))




@tag_bp.route('/tags/<int:resource_id>/tipo', methods=['GET']) #http://localhost:5000/tags/9/tipo?tipo=curso
def get_tags_by_quiz_pregunta(resource_id): 

    tipo = request.args.get('tipo')  
    
    if tipo == 'pregunta':
        tags = Tag.query.filter_by(tag_quiz_pregunta_id=resource_id).all()
        
    elif tipo == 'blog':
        tags = Tag.query.filter_by(tag_blog_id=resource_id).all() 
    
    elif tipo == 'video':
        tags = Tag.query.filter_by(tag_video_id=resource_id).all() 

    elif tipo == 'curso':
        tags = Tag.query.filter_by(tag_curso_id=resource_id).all() 
    
    else:
        return jsonify({'error': 'Tipo no válido'}), 400  

    if not tags: 
        return jsonify({'error': 'No tags found'}), 404 
    
    response = [
        {
            "tag_id": tag.tag_id,
            "tag_name": tag.tag_name,
            "resource_type": tipo  
        }
        for tag in tags
    ]

    return jsonify(response)  




@tag_bp.route('/tag/<int:tag_id>', methods=["DELETE"])
@admin_permits 
def delete_tag(tag_id):
    try:
        tag = Tag.query.get(tag_id)
        if not tag:
            return jsonify({"error": "Tag not found"}), 404

        db.session.delete(tag)
        db.session.commit()

        return jsonify({"message": "Tag deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@tag_bp.route('/tags', methods=["DELETE"])
@admin_permits 
def delete_all_tags():
    try:
        Tag.query.delete()
        db.session.commit()

        return jsonify({"message": "All tags deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@tag_bp.route('/tag/<int:tag_id>', methods=["PUT"])
@admin_permits 
def update_tag(tag_id):
    tag_input = request.json.get('tag_name')

    try:
        tag = Tag.query.get(tag_id)
        if not tag:
            return jsonify({"error": "Tag not found"}), 404

        if tag_input:
            tag.tag_name = tag_input

        db.session.commit()
        return jsonify({"message": "Tag updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500



