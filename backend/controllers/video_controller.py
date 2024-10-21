from flask import Blueprint, request, jsonify
from extensions import db  
from marshmallow.exceptions import ValidationError
from sqlalchemy.exc import IntegrityError

from models.video import Video
from schemas.video_schema import video_schema, videos_schema  
from decorators.admin_permits import admin_permits

video_bp = Blueprint('video', __name__)

@video_bp.route('/video', methods=["POST"])
@admin_permits
def create_video():

    title = request.json.get('video_title')
    content = request.json.get('video_content')
    url = request.json.get('video_url')


    if not title or not content:
        return jsonify({"error": "Please check the required fields"}), 400
          
    try:
        new_video = Video(title, content, url)

        db.session.add(new_video)
        db.session.commit()

        return jsonify({"message": "Video created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
        



@video_bp.route('/video/<int:video_id>', methods=['GET'])
def get_video(video_id):
    
    video = Video.query.get(video_id)
    if not video:
        return jsonify({'error': 'Video not found'}), 404
    return  jsonify(video_schema.dump(video))




@video_bp.route('/videos', methods=['GET'])
def get_videos():
    limit = request.args.get('limit', default=10, type=int)
    offset = request.args.get('offset', default=0, type=int)

    videos = Video.query.limit(limit).offset(offset).all()
    if not videos:
        return jsonify({'error': 'No videos found'}), 404  
    return  jsonify(videos_schema.dump(videos))




@video_bp.route('/video/<int:video_id>', methods=["DELETE"])
@admin_permits 
def delete_video(video_id):
    try:
        video = Video.query.get(video_id)
        if not video:
            return jsonify({"error": "Video not found"}), 404

        db.session.delete(video)
        db.session.commit()

        return jsonify({"message": "Video deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@video_bp.route('/videos', methods=["DELETE"])
@admin_permits 
def delete_all_videos():
    try:
        Video.query.delete()
        db.session.commit()

        return jsonify({"message": "All videos deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




@video_bp.route('/video/<int:video_id>', methods=["PUT"])
@admin_permits 
def update_video(video_id):
    title = request.json.get('video_title')
    content = request.json.get('video_content')
    url = request.json.get('video_url')

    try:
        video = Video.query.get(video_id)
        if not video:
            return jsonify({"error": "Video not found"}), 404

        # Solo actualizar si se proporciona un valor en la solicitud
        if title:
            video.video_title = title
        if content:
            video.video_content = content
        if url:
            video.video_url = url

        db.session.commit()

        return jsonify({"message": "Video updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
