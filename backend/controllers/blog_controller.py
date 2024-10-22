import base64
import logging
from flask import Blueprint, request, jsonify
from extensions import db  
from models.blog import Blog
from decorators.admin_permits import admin_permits

blog_bp = Blueprint('blog', __name__)

@blog_bp.route('/blog', methods=["POST"])
@admin_permits
def create_blog():
    title = request.form.get('blog_title')  # deben ser request.form porque los datos son enviados como multipart/form-data, que es el formato adecuado para formularios que contienen archivos (como imágenes).
    content = request.form.get('blog_content')  
    img_file = request.files.get('blog_img')  

    if not title or not content:
        return jsonify({"error": "Please check the required fields"}), 400

    try:
        img_binary = None
        if img_file:  #
            img_binary = img_file.read()  # Lee el contenido del archivo y convierte la imagen a un formato binario que puede ser almacenado en la base de datos

        new_blog = Blog(blog_title=title, blog_content=content, blog_img=img_binary)  # se agrega un nuevo elemento a la tabla de la db
        db.session.add(new_blog)
        db.session.commit()

        return jsonify({"message": "Blog created successfully", "blog_id": new_blog.blog_id}), 201

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error al crear el blog: {str(e)}") # función logging q registra errores, funcioón str(e) convierte el error a un mensaje legible
        return jsonify({"error": "An error occurred while creating the blog."}), 500


@blog_bp.route('/blogs', methods=['GET'])
def get_blogs():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    blogs = Blog.query.limit(limit).offset(offset).all()
    blog_list = []

    for blog in blogs:
        blog_img = None
        if blog.blog_img:
            blog_img = base64.b64encode(blog.blog_img).decode('utf-8')
            blog_img = f"data:image/png;base64,{blog_img}"

        blog_data = {
            'blog_id': blog.blog_id,
            'blog_title': blog.blog_title,
            'blog_content': blog.blog_content,
            'blog_img': blog_img
        }
        blog_list.append(blog_data)

    return jsonify(blog_list or {'error': 'No blogs found'}), 404 if not blog_list else 200

@blog_bp.route('/blog/<int:blog_id>', methods=['GET'])
def get_blog(blog_id):
    blog = Blog.query.get(blog_id)
    if not blog:
        return jsonify({'error': 'Blog not found'}), 404
    
    blog_img = None
    if blog.blog_img:
        blog_img = base64.b64encode(blog.blog_img).decode('utf-8')
        blog_img = f"data:image/png;base64,{blog_img}"

    blog_data = {
        'blog_id': blog.blog_id,
        'blog_title': blog.blog_title,
        'blog_content': blog.blog_content,
        'blog_img': blog_img
    }

    return jsonify(blog_data)

@blog_bp.route('/blog/<int:blog_id>', methods=["PUT"])
@admin_permits 
def update_blog(blog_id):
    title = request.json.get('blog_title')
    content = request.json.get('blog_content')
    img_base64 = request.json.get('blog_img')  # Recibe la imagen en formato Base64 (opcional)

    try:
        blog = Blog.query.get(blog_id)
        if not blog:
            return jsonify({"error": "Blog not found"}), 404

        # Actualizo los campos proporcionados
        if title:
            blog.blog_title = title
        if content:
            blog.blog_content = content
        
        # Verifico si la imagen fue enviada
        if img_base64:
            if "," in img_base64:
                img_base64 = img_base64.split(",")[1]  # Remover el encabezado 'data:image/png;base64,'
            img_binary = base64.b64decode(img_base64)  # Convertir a binario
            blog.blog_img = img_binary  # Actualizar la imagen si existe

        db.session.commit()

        return jsonify({"message": "Blog updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error al actualizar el blog: {str(e)}")
        return jsonify({"error": str(e)}), 500

@blog_bp.route('/blog/<int:blog_id>', methods=["DELETE"])
@admin_permits 
def delete_blog(blog_id):
    try:
        blog = Blog.query.get(blog_id)
        if not blog:
            return jsonify({"error": "Blog not found"}), 404

        db.session.delete(blog)
        db.session.commit()

        return jsonify({"message": "Blog deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error al eliminar el blog: {str(e)}")
        return jsonify({"error": str(e)}), 500

@blog_bp.route('/blogs', methods=["DELETE"])
@admin_permits 
def delete_all_blogs():
    try:
        Blog.query.delete()
        db.session.commit()

        return jsonify({"message": "All blogs deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        logging.error(f"Error al eliminar todos los blogs: {str(e)}")
        return jsonify({"error": str(e)}), 500
