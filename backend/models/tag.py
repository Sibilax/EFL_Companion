from extensions import db 
from .curso import Curso
from .quiz_pregunta import QuizPregunta
from .blog import Blog
from .video import Video

class Tag(db.Model):
    tag_id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    tag_name = db.Column(db.String(255), unique=False, nullable=False)
    tag_curso_id = db.Column(db.Integer, db.ForeignKey('curso.curso_id'), nullable=True)
    tag_quiz_pregunta_id = db.Column(db.Integer, db.ForeignKey('quiz_pregunta.quiz_pregunta_id'), nullable=True)
    tag_blog_id = db.Column(db.Integer, db.ForeignKey('blog.blog_id'), nullable=True)
    tag_video_id = db.Column(db.Integer, db.ForeignKey('video.video_id'), nullable=True)

    curso = db.relationship('Curso', backref=db.backref('tags', lazy=True))
    quiz_pregunta = db.relationship('QuizPregunta', backref=db.backref('tags', lazy=True))
    blog = db.relationship('Blog', backref=db.backref('tags', lazy=True))
    video = db.relationship('Video', backref=db.backref('tags', lazy=True))
    
    
    def __str__(self):
        return (f'Tag {self.tag_name}')