from flask import Blueprint, request, jsonify
from extensions import db  
from models.blog import Blog  
from models.video import Video 
from models.tag import Tag 

searchbar_bp = Blueprint('searchbar', __name__)

@searchbar_bp.route('/search', methods=['GET'])  # http://localhost:5000/search?query=english&limit=10&offset=0
def searchbar():
    # Se definen los parámetros de búsqueda
    query = request.args.get('query')  # Ej: "english", "blog", "video"
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    # Se incializan las listas para los resultados
    blog_results = []
    video_results = []

    # Si hay consulta, es decir, si se ha ingresado algo al input, buscamos tanto en tags como en títulos y contenidos
    if query:
        keywords = query.split()  # Dividimos la consulta en palabras clave (por si hay más de una)

        # Filtrar tags que coincidan con la palabra clave
        tags = Tag.query.filter(
            db.or_(   #función de sql alchemy para hacer consultas en bd
                *[Tag.tag_name.ilike(f"%{keyword}%") for keyword in keywords]  #lista de expresiones a filtrar. Se indica la tabla, la columna, ilike para que no sea case sensitive y f"%{keyword}%" filtra cualquier cadena que contenga eso
            )
        ).limit(limit).offset(offset).all()

        # Recorrer los tags encontrados y devolver los blogs y videos asociados
        for tag in tags:
            if tag.tag_blog_id:
                blog = Blog.query.get(tag.tag_blog_id)
                if blog:
                    blog_results.append({
                        'id': blog.blog_id,
                        'title': blog.blog_title,
                        'content': blog.blog_content
                    })

            if tag.tag_video_id:
                video = Video.query.get(tag.tag_video_id)
                if video:
                    video_results.append({
                        'id': video.video_id,
                        'title': video.video_title,
                        'content': video.video_content
                    })

        # Buscar en los títulos y contenidos de los blogs
        blogs = Blog.query.filter(
            db.or_(
                *[Blog.blog_title.ilike(f"%{keyword}%") | Blog.blog_content.ilike(f"%{keyword}%")
                  for keyword in keywords]
            )
        ).limit(limit).offset(offset).all()

        # Añadir los blogs encontrados a los resultados
        for blog in blogs:
            blog_results.append({
                'id': blog.blog_id,
                'title': blog.blog_title,
                'content': blog.blog_content
            })

        # Buscar en los títulos y contenidos de los videos
        videos = Video.query.filter(
            db.or_(
                *[Video.video_title.ilike(f"%{keyword}%") | Video.video_content.ilike(f"%{keyword}%")
                  for keyword in keywords]
            )
        ).limit(limit).offset(offset).all()

        # Añadir los videos encontrados a los resultados
        for video in videos:
            video_results.append({
                'id': video.video_id,
                'title': video.video_title,
                'content': video.video_content
            })

        # Devolver los resultados en formato JSON
        results = {
            'blogs': blog_results,
            'videos': video_results
        }

        return jsonify(results)

    # Si no hay consulta, devolver un error
    return jsonify({'error': 'No query provided'}), 400
