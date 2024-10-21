from extensions import db 
from .quiz_pregunta import QuizPregunta

class QuizRespuesta(db.Model):
    quiz_respuesta_id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    quiz_respuesta_opcion = db.Column(db.String(80), nullable=False)
    quiz_respuesta_contenido = db.Column(db.Text, nullable=False)
    quiz_respuesta_correcta = db.Column(db.Boolean, nullable=False) 
    quiz_respuesta_pregunta_id = db.Column(db.Integer, db.ForeignKey('quiz_pregunta.quiz_pregunta_id'), nullable=False) 


    def __str__(self):
        return f'QuizRespuesta {self.quiz_respuesta_opcion}'

