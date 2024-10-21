from extensions import db 

class Curso(db.Model):
    curso_id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True, nullable=False)
    curso_name = db.Column(db.String(255), nullable=False)
    curso_description = db.Column(db.Text, nullable=False)
    curso_level = db.Column(db.String(80), nullable=False)
    curso_img = db.Column(db.Text)

    def __init__(self, curso_name, curso_description, curso_level, curso_img=None):
        self.curso_name = curso_name
        self.curso_description = curso_description
        self.curso_level = curso_level
        self.curso_img = curso_img


    def __str__(self):
        return (f'Curso: {self.curso_name}, '
                f'Nivel: {self.curso_level} ')