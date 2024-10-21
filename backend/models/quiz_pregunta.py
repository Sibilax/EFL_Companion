from extensions import db 

class QuizPregunta(db.Model):
    quiz_pregunta_id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    quiz_pregunta_nivel = db.Column(db.String(255), nullable=False)
    quiz_pregunta_contenido = db.Column(db.String(500), nullable=False)

    respuestas = db.relationship('QuizRespuesta', cascade="all, delete", backref='pregunta')

    def __init__(self, quiz_pregunta_nivel, quiz_pregunta_contenido):
        self.quiz_pregunta_nivel = quiz_pregunta_nivel
        self.quiz_pregunta_contenido = quiz_pregunta_contenido

    def __str__(self):
        return (f'Pregunta: {self.quiz_pregunta_contenido}')